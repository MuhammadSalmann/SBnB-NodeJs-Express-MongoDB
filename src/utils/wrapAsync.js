// To overcome try and catch block in every async function, we can create a wrapper function that will handle the try and catch block for us. This will make our code cleaner and more readable. We can create a wrapAsync function that will take an async function as an argument and return a new function that will handle the try and catch block for us.
module.exports = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}