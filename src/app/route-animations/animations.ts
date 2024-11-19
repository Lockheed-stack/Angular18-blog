import { trigger, transition, style, query, animateChild, group, animate } from "@angular/animations";

export const slideInAnimation =
    trigger('routeAnimations', [
        transition('HomePage => BlogPage, HomePage => CategoryPage, CategoryPage => BlogPage', [
            style({ position: 'relative' }),
            query(
                ':enter, :leave',
                [
                    style({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                    }),
                ]
            ),
            query(':enter', [style({ left: '100%' })], { optional: true }),
            query(':leave', animateChild(), { optional: true }), group(
                [
                    query(':leave', [animate('300ms ease-out', style({ left: '-100%' }))], { optional: true }),
                    query(':enter', [animate('300ms ease-out', style({ left: '0%' }))], { optional: true }),
                ]
            ),
        ]),
        transition('BlogPage => HomePage, BlogPage => CategoryPage, CategoryPage => HomePage', [
            style({ position: 'relative' }),
            query(
                ':enter, :leave',
                [
                    style({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100%',
                    }),
                ]
            ),
            query(':enter', [style({ right: '100%' })], { optional: true }),
            query(':leave', animateChild(), { optional: true }), group(
                [
                    query(':leave', [animate('300ms ease-out', style({ right: '-100%' }))], { optional: true }),
                    query(':enter', [animate('300ms ease-out', style({ right: '0%' }))], { optional: true }),
                ]
            ),
        ]),
    ]);

export const openAnimation =
    trigger('routeOpenAnimation', [
        transition('IndexFrameworkPage => ManagementPage', [
            style({ position: 'relative'}),
            query(
                ':enter, :leave',
                [
                    style({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100%',
                    }),
                ]
            ),
            query(':enter', [style({ right: '100%' })], { optional: true }),
            query(':leave', animateChild(), { optional: true }), group(
                [
                    query(':leave', [animate('300ms ease-out', style({ right: '-100%' }))], { optional: true }),
                    query(':enter', [animate('300ms ease-out', style({ right: '0%' }))], { optional: true }),
                ]
            ),
        ])
    ]);