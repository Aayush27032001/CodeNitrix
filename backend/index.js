const express = require('express');
const cors = require('cors');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const questionRouter = require('./routes/questionRoutes');
const testRouter = require('./routes/testRoutes');
const resultRouter = require('./routes/resultRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// midleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
  res.status(200).send('Hello Server is Up and fine!');
});

app.post('/js', (req, res) => {
  // console.log(req.body);
  fs.writeFileSync('./JSCodes/Code.js', req.body.code);
  try {
    const func = require('./JSCodes/Code');
    // console.log(func);
    const testCase = [[1, 2, 3, 4, 5], [9, 9, 55, 1, 4], [], [1]];
    const CorrectResults = [15, 78, 0, 1];
    const userResults = CorrectResults.map((e, i) => {
      if (func(testCase[i]) === e) return true;
      return false;
    });
    // fs.unlinkSync("./JSCodes/Code.js")
    res.status(200).json({
      message: 'Evaluation Done!',
      data: userResults,
    });
  } catch (e) {
    // fs.unlinkSync("./JSCodes/Code.js")
    res.status(500).json({
      message: 'Time Limit Exced or Code having syntax error',
    });
  }
});

app.use('/api/questions', questionRouter);
app.use('/test', testRouter);
app.use('/result', resultRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
