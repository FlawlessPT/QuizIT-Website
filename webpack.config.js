{
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader', options: { inline: true }
                }
            }
        ]
    }
}
