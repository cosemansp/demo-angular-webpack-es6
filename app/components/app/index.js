'use strict';

class App {
    constructor() {
        this.title = 'hello world';
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
