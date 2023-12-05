define(['qlik', 'jquery', 'css!./styles.css', 'text!./index.html'], function (
    qlik,
    $,
    styles,
    html
) {
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
        const { presetOptions, title, height, fontSize, customStyles } =
            layout.appearance;

        const customCss = [];

        if (presetOptions) {
            classifications.forEach((classification) =>
                $('body').removeClass(classification.value.className)
            );

            $('body').addClass(presetOptions.className);
        }

        if (title)
            customCss.push(`body:before { content: '${title}' !important; }`);

        if (height) {
            customCss.push(`
                body:before { 
                    height: ${height}px !important;
                    line-height: ${height}px !important;
                }
            `);
        } else {
            customCss.push(`
                body:before { 
                    height: 2rem !important;
                    line-height: 2rem !important;
                }
            `);
        }

        if (fontSize) {
            customCss.push(`
                body:before { 
                    font-size: ${fontSize}px !important;
                }
            `);
        } else {
            customCss.push(`
                body:before { 
                    font-size: 1rem !important;
                }
            `);
        }

        if (customStyles) {
            customCss.push(customStyles);
        }

        for (const css of customCss) {
            $('<style>').html(css).appendTo('head');
        }

        // Hide object when not in edit mode
        const classificationBannerObject = $('#classification-banner')
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent();

        const visibility =
            qlik.navigation.getMode() === 'edit' ? 'visible' : 'hidden';
        classificationBannerObject.css('visibility', visibility);
    }

    return {
        template: html,
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
                            label: 'Presets',
                            type: 'object',
                            defaultValue: {
                                className: 'unclassified',
                                label: 'UNCLASSIFIED',
                            },
                            options: classifications,
                        },
                        title: {
                            ref: 'appearance.title',
                            label: 'Banner Title',
                            type: 'string',
                            defaultValue: '',
                        },
                        fontSize: {
                            ref: 'appearance.fontSize',
                            label: 'Font size (px)',
                            type: 'number',
                            defaultValue: 16,
                        },
                        height: {
                            ref: 'appearance.height',
                            label: 'Height (px)',
                            type: 'number',
                            defaultValue: 24,
                        },
                        customStyles: {
                            ref: 'appearance.customStyles',
                            label: 'Custom CSS (need to refresh)',
                            type: 'string',
                            component: 'textarea',
                            expression: 'optional',
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

            const visibility =
                qlik.navigation.getMode() === 'edit' ? 'visible' : 'hidden';
            $element.css('visibility', visibility);

            console.log('$element: ', $element);
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
