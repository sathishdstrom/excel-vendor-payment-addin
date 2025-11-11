const path = require("path");
const fs = require("fs");

module.exports = {
    entry: "./src/app.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname), // <-- output to project root
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname),
        },
        port: 8080,
        hot: true,
        https: {
            key: fs.existsSync("localhost-key.pem")
                ? fs.readFileSync("localhost-key.pem")
                : undefined,
            cert: fs.existsSync("localhost.pem")
                ? fs.readFileSync("localhost.pem")
                : undefined,
        },
    },
};
