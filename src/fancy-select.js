'use strict';

var fancySelect = angular.module('fancySelect',['ionic']);

// Fancy select directive
fancySelect.directive('fancySelect', function($ionicModal) {
    return {
        /* Only use as <fancy-select> tag */
        restrict : 'E',

        /* Our template */
        template: '<ion-list><ion-item ng-click="showItems($event)">{{text}}<span class="item-note">{{noteText}}<img class="{{noteImgClass}}" ng-if="noteImg != null" src="{{noteImg}}" /></span></ion-item></ion-list>',

        /* Attributes to set */
        scope: {
            'items'        : '=', /* Items list is mandatory */
            'value'        : '='  /* Selected value binding is mandatory */
        },

        link: function (scope, element, attrs, $filter) {

            /* Default values */
            scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
            scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;

            /* Header used in ion-header-bar */
            scope.headerText    = attrs.headerText || '';

            /* Text displayed on label */
            scope.text          = attrs.text || '';
            scope.defaultText   = attrs.text || '';

            /* Notes in the right side of the label */
            scope.noteText      = attrs.noteText || '';
            scope.noteImg       = attrs.noteImg || '';
            scope.noteImgClass  = attrs.noteImgClass || '';

            /* Instanciate ionic modal view and set params */

            /* Some additionnal notes here :
             *
             * In previous version of the directive,
             * we were using attrs.parentSelector
             * to open the modal box within a selector.
             *
             * This is handy in particular when opening
             * the "fancy select" from the right pane of
             * a side view.
             *
             * But the problem is that I had to edit ionic.bundle.js
             * and the modal component each time ionic team
             * make an update of the FW.
             *
             * Also, seems that animations do not work
             * anymore.
             *
             */
            $ionicModal.fromTemplate(
                '<ion-view class="fancy-select slide-left-right-ios7 modal"><ion-header-bar class="bar-positive"><button class="button button-positive button-icon ion-ios7-arrow-back" ng-click="validate()"/><h1 class="title">{{headerText}}</h1></ion-header-bar><ion-content><div class="list"><ion-toggle class="item" ng-checked="item.checked" ng-if="multiSelect" ng-model="item.checked" ng-repeat="item in items"><img alt="{{item.text}}" class="fancy-select-icon" ng-if="item.icon != null" src="{{item.icon}}"/>{{item.text}}</ion-toggle><label class="item" ng-click="validateSingle(item)" ng-if="!multiSelect" ng-repeat="item in items"><img alt="{{item.text}}" class="fancy-select-icon" ng-if="item.icon != null" src="{{item.icon}}"/>{{item.text}}</label></div></ion-content></ion-view>',
                { 'scope': scope,
                    'animation': 'slide-left-right-ios7' }
            ).then(function(modal) {
                    scope.modal = modal;
                });

            /* Validate selection from header bar */
            scope.validate = function (event) {
                // Construct selected values and selected text
                if (scope.multiSelect == true) {

                    // Clear values
                    scope.value = '';
                    scope.text = '';

                    // Loop on items
                    jQuery.each(scope.items, function (index, item) {
                        if (item.checked) {
                            scope.value = scope.value + item.id+';';
                            scope.text = scope.text + item.text+', ';
                        }
                    });

                    // Remove trailing comma
                    scope.value = scope.value.substr(0,scope.value.length - 1);
                    scope.text = scope.text.substr(0,scope.text.length - 2);
                }

                // Select first value if not nullable
                if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                    if (scope.allowEmpty == false) {
                        scope.value = scope.items[0].id;
                        scope.text = scope.items[0].text;

                        // Check for multi select
                        scope.items[0].checked = true;
                    } else {
                        scope.text = scope.defaultText;
                    }
                }

                // Hide modal
                scope.hideItems();
            }

            /* Show list */
            scope.showItems = function (event) {
                event.preventDefault();
                scope.modal.show();
            }

            /* Hide list */
            scope.hideItems = function () {
                scope.modal.hide();
            }

            /* Destroy modal */
            scope.$on('$destroy', function() {
                scope.modal.remove();
            });

            /* Validate single with data */
            scope.validateSingle = function (item) {

                // Set selected text
                scope.text = item.text;

                // Set selected value
                scope.value = item.id;

                // Hide items
                scope.hideItems();
            }
        }
    };
});