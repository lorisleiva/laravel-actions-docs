module.exports = {
    title: '⚡️ Laravel Actions',
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
        nav: [
            { text: 'Documentation', link: '/' },
        ],
        sidebar: [
            {
                title: 'Getting Started',
                collapsable: false,
                children: [
                    ['/', 'Introduction'],
                    '/installation',
                    '/basic-usage',
                    '/actions-attributes',
                    '/dependency-injections',
                    '/authorisation',
                    '/validation',
                ],
            },
            {
                title: 'Actions as...',
                collapsable: false,
                children: [
                    '/actions-as-objects',
                    '/actions-as-jobs',
                    '/actions-as-listeners',
                    '/actions-as-controllers',
                    '/actions-as-commands',
                ],
            },
            {
                title: 'Advanced',
                collapsable: false,
                children: [
                    'registering-actions',
                    'action-running-as',
                    'nested-actions',
                    'action-lifecycle',
                ],
            },
        ],
    }
}
