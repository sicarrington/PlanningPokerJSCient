const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/PlanningPokerConnection.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: { 
            type: "umd", 
            name: "planningpoker", 
            export: "default"
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: true
    },
};