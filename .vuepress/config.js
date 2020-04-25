module.exports = {
    title: 'Laravel Actions',
    description: 'Documentation for Laravel Actions',
    head: [
        ['link', { rel: 'icon', href: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/high-voltage-sign_26a1.png' }],
    ],
    themeConfig: {
        lastUpdated: 'Last Updated',
        repo: 'lorisleiva/laravel-actions',
        repoLabel: 'GitHub',
        docsRepo: 'lorisleiva/laravel-actions-docs',
        editLinks: true,
        editLinkText: 'Edit this page',
        displayAllHeaders: true,
        nav: [
            { text: 'Documentation', link: '/' },
        ],
        sidebar: [
            {
                title: 'Getting Started',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    ['/', 'Introduction'],
                    '/installation',
                    '/basic-usage',
                ]
            },
            {
                title: 'Advanced',
                collapsable: false,
                sidebarDepth: 1,
                children: [ /* ... */ ]
            }
        ],
    }
}
