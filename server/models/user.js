const mongoose = require("mongoose");
const encryption = require("../utils/encryption");

const defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPcAAAD3BAMAAAAzot9gAAAAD1BMVEWXmZaqrKm8vrvP0c7l5+SJiHyqAAAECUlEQVR42u3c0ZHaShAF0KshAa2dAC+DfRn4w2EbNgEWKQCEJoAVOwlo2n5f2IYnoe6eaSjm/lFQnL3dI5YqquS+2+Wbg2EKXvCCF7zgd4bT6fgrnyE/TsfdZv8f/r7b9Hlx6jbHcH7wo8+In97/0rqNz4V3+4s906HJgx+uDnl4y4DTweNqxm16vPvf7ca31Pi592XGJi0+eO6zcjzOdDuEdDjtMZN9OnyYLRZbPi5/54/Ax+UzbdLg402lRs/H5Z2OfFy+zej1cWoBZnU5HgGoV3f8jcurO62jfk4MyniPBWl0cfJL8FEXH7AorSreLsNPmnjEssSgiJ+wMK0i3i7Fox4egTRzdymmDng13C/HT1o4heV41MIjGPFK+Kcl3nLwqIMTDPERrHgVPFjinoeTZfOogUfwQpY4vAIeHhKngvNxgiEewU6QN7fEYYmHB8XpaXGIcRg2JyNcHsvmMG0epM3Lr8ichPLjfTlwC/GqXGoPh9dl5xbN62dtXklxmOK1QLfEq6fFazFePS3uLHD50isY4k7hJWvL5hV/5XLccfH1YzaXL93BEK9U8MoSd4LzJm9eG+CypTulF70Y4LKl13xcvvQ1G5cvvaq18C/ilet/CsoPqUOSua8N8arWw1dL8RX08GrNnrochym+Ykydh8vn/sLH5XNfs3H53F3NxuVzd9ov/GcB/qqNrxJMHU69Dr5AHf/KOOsMXHjkXM3G5UfOIQHu+FOX49U33JIVH5dfbf8iCV69so+bHMdX7W+6DrrVX9m4vNYKbFy+0Bc+Lh/qOiFeYSa1Ie5giFePiwt3WhfcAkdSHJbNq/ttXsGkuRyXpzS3wculVnZecBWcpp8teBr8cxoPSfGZd0+Le0ymT4mPmE6U4bJm5AW4+L37dPgwv5eQCqfW5GY25+Lz1e3uIQTsDe8hhNjwcfmtdAavjw8tbkwX2Lh8mvQedPFhC/B0Of7RYElo59Vw2rVYmEOjg1O3CVicYdMr4CfmTSap2wYhToc9uIm7XoTHjYcg3VaAD1vIEjeBi3cNpKGd5+GHHgo5+Amc8TerXfJu7iNSnqFZip/thLqT3U5S9i/ezZ4S3VM3j38o2+dJzuNjC/W834jHN+iHtrfhe6RIbCbw+W+p+kfeMRbOTDeLU4NUobc5fAhIljFM47FFwuyn8SNSJrZT+OiRNMMU3iBtqL2Gn09EzuqOX1xe3fGLy6s7RnF59Us8BmTI6Tp+Qo5Efw2nFlnSX8NH5Ml4DW+RKe0lTiEXfrrER+RKvMQ9ssXfFR6RL/Gu8ICMCX/hPifu76h5RM7EP3HKipMpHv7AA7LmjnBvhFuEfsep4M+A43c85GbDveAoY3+2sVN2lkpz4+awbE6wyU+pN6ugoJeLugAAAABJRU5ErkJggg==';

let userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: { type: String, unique: true },
    salt: { type: String, required: true },
    passHash: { type: String, required: true },
    about: { type: String, default: "Nothing here." },
    signature: { type: String, default: "Nothing here." },
    imageDataUrl: { type: String, default: defaultImage },
    writerRating: { type: Number, default: 0 },
    critiqueRating: { type: Number, default: 0 },
    rank: { type: String, default: "Newbie" },
    notifications: [],
    usersFollowing: [{
        username: String, _id: String
    }],
    usersFollowed: [{
        username: String,
        _id: String
    }]
});

userSchema.methods = {
    isValidPassword(password) {
        let realPassHash = this.passHash;
        let currentPassHash = encryption.getPassHash(this.salt, password);
        let isValid = currentPassHash === realPassHash;

        return isValid;
    }
};

let User = mongoose.model("user", userSchema);
module.exports = User;