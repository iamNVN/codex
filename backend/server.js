const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const cors = require('cors')

const axios = require('axios');

const bcrypt = require('bcrypt');
const app = express();

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/codex", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// MongoDB User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('Users', userSchema);

const historySchema = new mongoose.Schema({
    username: { type: String, required: true },
    dateTime: { type: Date, default: Date.now },  // Store the date and time of the entry
    code: { type: String, required: true },       // Store the code that was submitted
    review: { type: String, required: true },     // Store the output from running the code
    bugs: { type: Number, required: true },       // Number of bugs in the code
    rating: { type: String, required: true },  // Rating from 1 to 5
});

const History = mongoose.model('History', historySchema);




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(cors({
    origin: 'https://codex.iamnvn.in', // Frontend URL
    credentials: true, // Allow sending cookies and credentials
}));

app.options('*', cors({
    origin: 'https://codex.iamnvn.in',
    credentials: true,
}));

app.use(
    session({
        secret: 'a1b7c3d1e5',
        resave: false,
        saveUninitialized: true,
    })
);


///======[OPEN AI]======///

const apiKeys = [
    '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',
    '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',
    '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',
];

function getRandomApiKey() {
    return apiKeys[Math.floor(Math.random() * apiKeys.length)];
}

const openai = new OpenAI({
    apiKey: 'xxx',
});

///======[AUTH]======///

app.post('/api/api/login', async (req, res) => {
    const { uname, pwd } = req.body;

    try {
        const user = await User.findOne({ username: uname });
        if (user && (await bcrypt.compare(pwd, user.password))) {
            req.session.isLoggedIn = true;
            req.session.username = uname;
            res.redirect('https://codex.iamnvn.in/dashboard');
            // res.json({
            //     success: true,
            //     data: { id: 1, name: 'Naveen Kumar' }
            //   })
        } else {
            res.redirect('https://codex.iamnvn.in/login?errcode=9');
        }
    } catch (err) {
        res.redirect('https://codex.iamnvn.in/login?errcode=30');
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { uname, pwd } = req.body;
        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        /*
        9 - invalid username
        1 - empty 
        12 - pwd length
        18 - username taken
        30 - error
        */

        if (!usernameRegex.test(uname)) {
            res.redirect('https://codex.iamnvn.in/register?errcode=9');
            return;
        }

        if (!uname || !pwd) {

            res.redirect('https://codex.iamnvn.in/register?errcode=1');
            return;
        }
        if (pwd.length < 8) {

            res.redirect('https://codex.iamnvn.in/register?errcode=12');
            return;
        }

        const existingUser = await User.findOne({ username: uname });
        if (existingUser) {
            res.redirect('https://codex.iamnvn.in/register?errcode=18');
            return;
        }

        const hashedPassword = await bcrypt.hash(pwd, 10);
        const newUser = new User({ username: uname, password: hashedPassword });
        await newUser.save();
        req.session.isLoggedIn = true;
        req.session.username = uname;
        res.redirect('https://codex.iamnvn.in/dashboard');

    } catch (err) {
        res.redirect('https://codex.iamnvn.in/register?errcode=9');
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Failed');
        }
        res.clearCookie('connect.sid');
        res.status(200).send('Logged out successfully');
    });
});


///======[DEFAULT ROUTES]======///

// app.get('/api/', (req, res) => {
//     if (req.session.isLoggedIn) {
//         res.redirect('/home'); 
//     } else {
//         res.redirect('/login'); 
//     }
// });

// app.get('/api/home', (req, res) => {
//     // if (req.session.isLoggedIn) {
//     //     res.render('home', { username: req.session.username });
//     // } else {
//     //     res.redirect('/login'); 
//     // }

//     if (!req.session.isLoggedIn) {
//             res.redirect('/login'); 
//         }
// });

app.get('/api/home', (req, res) => {
    if (req.session.isLoggedIn) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/api/history', async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    try {
        const histories = await History.find(
            { username: req.session.username },
            { bugs: 1, rating: 1, dateTime: 1, _id: 1 }
        ).sort({ dateTime: -1 });

        res.json(histories);
    } catch (error) {
        console.error('Error fetching histories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/support', async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    const BOT_TOKEN = '1471512536:AAG--DOBtt51Ohd3Wm1Jt5Fp86LiIyal3BI';
    const CHAT_ID = '1050176975';
    const message = `
ðŸ’¼ *Contact - CodeX* \n\n
*Name:* ${req.body.name} \n
*Username:* ${req.body.username} \n
*Subject:* ${req.body.subject} \n\n
*Message:*\n${req.body.message}
`;

    try {
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
        });
        return res.status(200).json({ success: "true", message: 'Message sent successfully' });
    } catch (error) {
        
        console.error('Error fetching histories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/getCode/:id', async (req, res) => {
    const { id } = req.params;
    if (!req.session.username) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        const history = await History.findById(id);

        if (!history) {
            return res.status(404).json({ error: 'History not found' });
        }

        res.setHeader('Content-Type', 'text/plain');
        res.send(history.code);
    } catch (error) {
        console.error('Error fetching code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/getReview/:id', async (req, res) => {
    const { id } = req.params;
    if (!req.session.username) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        const history = await History.findById(id);

        if (!history) {
            return res.status(404).json({ error: 'History not found' });
        }

        res.setHeader('Content-Type', 'text/plain');
        res.send(history.review);
    } catch (error) {
        console.error('Error fetching code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const getUsernameFromSession = (req) => {
    if (req.session && req.session.username) {
        return req.session.username;
    } else {
        return null;
    }
};

app.get('/api/status', (req,res) => {
    res.send("200");
});
///======[API]======///
app.post('/api/analyze', async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ status: 'error', error: 'Code and language are required.' });
    }


    try {
        // Get a random API key if you have multiple keys
        const apiKey = getRandomApiKey();
        openai.apiKey = apiKey; // Update the API key dynamically

        // Send request to OpenAI for code review
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // or any other model you want to use
            messages: [
                {
                    role: "system",
                    content: `
                        You are a sophisticated AI code reviewer. Analyze the provided code, 
                        identify any bugs, and you MUST rate its quality on a scale from 1 to 10 in the format 5/10.
                        Provide a detailed review in your response. 
                        also, dont leave too many empty lines. one line between heading and its content.
                        Include line number when talking about a bug or line.
                        You HAVE to provide a rating from 1 to 10. Its Mandatory.

                        Format:
                        ### === [Code Review] ===

                        Your Review,overview of what the code does, security issues if any, etc

                        ### === [Bugs and Issues] ===

                        List them out

                        ### === [Rating] ===

                        Rating: 5/10
                    `,
                },
                {
                    role: "user",
                    content: `
                        Language: ${language}
                        Code:
                        ${code}
                    `,
                }
            ],
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        // Extract review from the response
        const review = (response.choices && 
                response.choices[0] && 
                response.choices[0].message && 
                response.choices[0].message.content) 
                || 'No review generated.';

        const reviewBeforeRating = review.split("### === [Rating]")[0].trim();
        // console.log(review);

        const bugsFound = (review.match(/bug|error|issue/gi) || []).length;
        const match = review.match(/\b(\d{1,2}\/10)\b/);
        const rating = (match && match[1]) || 'Not provided';


        res.status(200).json({
            status: 'success',
            review: reviewBeforeRating,
            bugsFound: bugsFound,
            rating: rating
        });
        const newHistory = new History({
            username: getUsernameFromSession(req),
            code: code,
            review: reviewBeforeRating,
            bugs: bugsFound,
            rating: rating,
        });
        await newHistory.save();
    } catch (error) {

        // Check if it's a quota error
        if (error.status === 429) {
            res.status(429).json({
                status: 'error',
                message: 'You have exceeded the allowed number of requests per minute. Please try again later.',
            });
        } else {
            console.error('Error:', error);
            // Generic error handler
            res.status(500).json({
                status: 'error',
                message: error.code || 'Internal Server Error',
            });
        }
    }

});

app.listen();