module.exports = {
    verbose: false,
    plugins: {
        local: {
            browsers: ['chrome'],
            seleniumPort: 4444,
            skipSelenium: false // You have your own selenium server running
        },
        sauce: false,
        istanbul: {
            dir: "./coverage",
            reporters: ["text-summary", "lcov"],
            include: [
				      "**/modules/assetMgmt/components/*.html"
            ],
            exclude: [
                "/polymer/polymer.js",
                "/platform/platform.js"
            ]
        }
    }
};
