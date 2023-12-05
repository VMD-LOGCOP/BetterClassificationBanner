define(['qlik', 'jquery', 'css!./styles.css'], function (qlik, $, styles) {
    const classifications = [
        {
            label: 'Unclassified',
            value: { className: 'unclassified', label: 'UNCLASSIFIED' },
        },
        {
            label: 'CUI',
            value: { className: 'cui', label: 'CUI' },
        },
        {
            label: 'CONFIDENTIAL',
            value: { className: 'confidential', label: 'CONFIDENTIAL' },
        },
        {
            label: 'SECRET',
            value: { className: 'secret', label: 'SECRET' },
        },
        {
            label: 'TOP SECRET',
            value: { className: 'top-secret', label: 'TOP SECRET' },
        },
        {
            label: 'TOP SECRET/SCI',
            value: { className: 'ts-sci', label: 'TOP SECRET/SCI' },
        },
    ];

    function render(layout) {
        const { presetOptions, title } = layout.appearance;
        if (presetOptions) {
            classifications.forEach((classification) =>
                $('body').removeClass(classification.value.className)
            );

            $('body').addClass(presetOptions.className);
        }

        if (title) {
            const css = `body:before { content: '${title}' !important; }`;
            $('<style>').html(css).appendTo('head');
        }
    }

    return {
        support: {
            snapshot: true,
            export: true,
            exportData: false,
        },
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
                appearance: {
                    type: 'items',
                    label: 'Appearance',
                    items: {
                        presetOptions: {
                            ref: 'appearance.presetOptions',
                            component: 'dropdown',
                            label: 'Presets:',
                            type: 'object',
                            defaultValue: {
                                className: 'unclassified',
                                label: 'UNCLASSIFIED',
                            },
                            options: classifications,
                        },
                        title: {
                            ref: 'appearance.title',
                            label: 'Banner Title:',
                            type: 'string',
                            defaultValue: '',
                        },
                    },
                },
            },
        },
        paint: function ($element, layout) {
            //add your rendering code here
            // $element.html('BetterClassificationBanner');
            // needed for export
            render(layout);
            return qlik.Promise.resolve();
        },

        controller: [
            '$scope',
            function ($scope) {
                const layout = $scope.layout;

                $(document).ready(() => {
                    render(layout);
                });
            },
        ],
    };
});
