import angular from 'angular';
import uiRouter from 'angular-ui-router';

import app from './components/app';

export default angular
    .module('myApp', [
        // 3th party
        uiRouter,

        // application
    ])
    .component('app', app)
    .constant('appVersion', VERSION) // eslint-disable-line  no-undef
    ;
