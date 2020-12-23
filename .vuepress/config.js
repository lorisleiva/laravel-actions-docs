module.exports = {
    title: 'Laravel Actions',
    description: 'Run your plain PHP classes as anything you want.',
    head: [
        ['link', { rel: 'icon', href: '/logo_icon.png' }],
    ],
    themeConfig: {
        logo: '/logo_icon.png',
        lastUpdated: 'Last Updated',
        repo: 'lorisleiva/laravel-actions',
        repoLabel: 'GitHub',
        docsRepo: 'lorisleiva/laravel-actions-docs',
        docsBranch: 'main',
        editLinks: true,
        editLinkText: 'Edit this page',
        nav: [
            { text: 'Documentation', link: '/' },
            {
                text: 'Version',
                items: [
                    { text: '2.x', link: '/' },
                    { text: '1.x', link: '/1.x/' }
                ]
            },
        ],
        sidebar: {
            '/1.x/': [
                {
                    title: 'Getting Started',
                    collapsable: false,
                    children: [
                        ['/1.x/', 'Introduction'],
                        '/1.x/installation',
                        '/1.x/basic-usage',
                        '/1.x/actions-attributes',
                        '/1.x/dependency-injections',
                        '/1.x/authorisation',
                        '/1.x/validation',
                    ],
                },
                {
                    title: 'Actions as...',
                    collapsable: false,
                    children: [
                        '/1.x/actions-as-objects',
                        '/1.x/actions-as-jobs',
                        '/1.x/actions-as-listeners',
                        '/1.x/actions-as-controllers',
                        '/1.x/actions-as-commands',
                    ],
                },
                {
                    title: 'Advanced',
                    collapsable: false,
                    children: [
                        '/1.x/registering-actions',
                        '/1.x/action-running-as',
                        '/1.x/nested-actions',
                        '/1.x/action-lifecycle',
                    ],
                },
            ],
            '/': [
                {
                    title: 'Getting Started',
                    collapsable: false,
                    children: [
                        ['/', 'Introduction'],
                        '/2.x/installation',
                        '/2.x/basic-usage',
                        '/2.x/upgrade',
                    ],
                },
                {
                    title: 'Learn with examples',
                    collapsable: false,
                    children: [
                        '/2.x/todo-example',
                    ],
                },
                {
                    title: 'Guide',
                    collapsable: false,
                    children: [
                        '/2.x/one-class-one-task',
                        '/2.x/register-as-controller',
                        '/2.x/add-validation-to-controllers',
                        '/2.x/dispatch-jobs',
                        '/2.x/listen-for-events',
                        '/2.x/execute-as-commands',
                        '/2.x/mock-and-test',
                        '/2.x/granular-traits',
                    ],
                },
                {
                    title: 'References',
                    collapsable: false,
                    children: [
                        '/2.x/as-object',
                        '/2.x/as-controller',
                        '/2.x/as-job',
                        '/2.x/as-listener',
                        '/2.x/as-command',
                        '/2.x/as-fake',
                    ],
                },
            ]
        },
    },
    domain: 'https://laravelactions.com/',
    plugins: {
        'seo': {
            type: _ => 'website',
            description: (_, $site) => $site.description,
            image: (_, $site) => $site.domain + 'hero.png',
        }
    },
}
