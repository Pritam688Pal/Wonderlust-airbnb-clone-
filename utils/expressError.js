class ExpressError extends Error {
    constructor(statusCode=500,message="Something went wrong") {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
