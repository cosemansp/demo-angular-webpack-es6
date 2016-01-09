'use strict';

class App {
    // @ngInject
    constructor($log) {
        this.title = 'hello world';
        $log.info('hello this is my first log');
    }
}

export default {
    template: `
        <h1>My App: {{app.title}}</h1>
        <div class="app">
            <div ui-view></div>
        </div>
    `,
    controller: App,
};
