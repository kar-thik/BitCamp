angular.module('ncsolar').controller('IndexCtrl', ["$scope", "Restangular", "listService", "$q", "alert", function($scope, Restangular, listService, $q, alert) {

    /*
    * -----------------------------------------------------------------------------------------------------------------
    * Initialization of Controller
    * - set up controller properties, datatables, and act on any data passed from the server via the Init() function
    * -----------------------------------------------------------------------------------------------------------------
     */

    $scope.msgWrapperText = 'Use the filter options to refine your search';

    $scope.recordsTotal = 0;

    //property to track the currently logged-in user's role
    $scope.role = 'guest';

    //is the current user an admin?
    $scope.isLoggedIn = function () {
        // rename to 'logged in'
        return $scope.role != 'guest';
    }

    //init method to pass user role and query params through to controller via ng-init
    $scope.init = function (params) {
        //Set user role and pre-populate any state or zipcode filters passed as query params
        if (params.role) {
            $scope.role = params.role;
        }
        $.each(params['initFilters'], $scope.setInitFilters);
        //initialize angular datatables
        var isLoggedIn = $scope.isLoggedIn();

        listService.attachTo($scope, $scope.restangularPrograms, {
            url: $scope.getProgramsUrlWithQueryParamsFromFilters(),
            columns: [
                {
                    property: 'name',
                    label: 'Name',
                    render: function (name, display, program, position) {
                        return (isLoggedIn ? '<a class="edit-program-btn" href="/system/program/edit/' + program.id + '" title="Edit program"><span class="icon-pencil"></span></a>' : '') +
                        '<a href="/system/program/detail/' + program.id + '" title="View program">' + name + '</a>';
                    }
                },
                {
                    property: 'stateObj.abbreviation',
                    label: 'State/ Territory'
                },
                {
                    property: 'categoryObj.name',
                    label: 'Category'
                },
                {
                    property: 'typeObj.name',
                    label: 'Policy/Incentive Type'
                },
                //Only show column if logged in
                {
                    property: 'published',
                    label: 'Visible to Public',
                    notVisible: !isLoggedIn
                },
                {
                    property: 'createdTs',
                    label: 'Created'

                },
                {
                    property: 'updatedTs',
                    label: 'Last Updated'
                }
            ],
            //order by  by default
            order: [[6, 'desc']],
            displayLength: 50,
            lengthMenu: [[10, 50, 250, -1], [10, 50, 250, 'All']]
        });
        $scope.subscribeToAllProgramsUrl = params['subscribeToAllProgramsUrl'];
    }

    $scope.restangularPrograms = Restangular.all('programs');
    $scope.flyoutMenu = $('#filtersFlyout');

    /*
    * -----------------------------------------------------------------------------------------------------------------
    * Track and Manipulate Program Filters
    * -----------------------------------------------------------------------------------------------------------------
    */

    //tracks the master list of currently in-use filters
    $scope.filters = {};

    //tracks the list of filters from the current panel
    $scope.tempFilters = {};

    //Set a filter option on a given filter set
    $scope.setFilter = function (type, filterObject, setTempFilter) {
        if (setTempFilter) {
            var filterCollection = $scope.tempFilters;
        } else {
            var filterCollection = $scope.filters;
        }
        if (!filterCollection[type]) {
            filterCollection[type] = {};
        }
        filterCollection[type][filterObject.id] = {
            type: type,
            typeLabel: $scope.getFilterLabelForType(type),
            id: filterObject.id,
            valueLabel: filterObject.label || filterObject.name
        }
        if (type == 'state') {
            filterCollection[type][filterObject.id]['abbreviation'] = filterObject.abbreviation;
        }
    }

    //sets multiple filter options for a given filter set
    $scope.setMultipleFilter = function (type, filterObject, setTempFilter) {
        if (setTempFilter) {
            var filterCollection = $scope.tempFilters;
        } else {
            var filterCollection = $scope.filters;
        }
        if (!$scope.tempFilters[type]) {
            filterCollection[type] = {};
        }
        if (filterCollection[type][filterObject.id]) {
            $scope.removeTempFilter(type, filterObject.id);
        } else {
            filterCollection[type][filterObject.id] = {
                type: type,
                typeLabel: $scope.getFilterLabelForType(type),
                id: filterObject.id,
                valueLabel: filterObject.label || filterObject.name
            };
            if (type == 'state') {
                filterCollection[type][filterObject.id]['abbreviation'] = filterObject.abbreviation;
            }
        }
    }

    //sets the initial filters on-load based on data passed from the server
    $scope.setInitFilters = function (type, filterObject) {
        switch (type) {
            case 'zipcode':
                $scope.setFilter('zipcode', filterObject);
                break;
            default:
                if (filterObject) {
                    $scope.setFilter(type, filterObject);
                }
        }
    }

    //returns whether or not a filter has been set for a given type
    $scope.hasFilters = function () {
        return !$.isEmptyObject($scope.filters);
    }

    //returns the label to display in the filter option for a given filter type
    $scope.getFilterLabelForType = function (type) {
        switch (type) {
            case 'energycategory':
                return 'Energy Category';
            case 'technologycategory':
                return 'Technology Category';
            case 'technology':
                return 'Technology';
            case 'updatedfrom':
                return 'Updated After';
            case 'updatedto':
                return 'Updated Before';
            case 'expiredfrom':
                return 'Expires After';
            case 'expiredto':
                return 'Expires Before';
            case 'category':
                return 'Category';
            case 'type':
                return 'Program Type';
            case 'implementingsector':
                return 'Implementing Sector';
            case 'state':
                return 'State/Territory';
            case 'utility':
                return 'Utility';
            case 'county':
                return 'County';
            case 'city':
                return 'City';
            case 'zipcode':
                return 'Zip Code';
            case 'sector':
                return 'Eligible Sector';
            case 'territories':
                return 'U.S. Territories';
            case 'fromSir':
                return 'From SIR';
            default:
                return '';
        }
    }

    //return the currently selected state filter (or null if unselected)
    $scope.getCurrentStateFilter = function() {
        if(Object.keys($scope.getFilters('state'))[0]) {
            return Object.keys($scope.getFilters('state'))[0];
        }
        return null;
    }

    //returns an individual filter or filter container depending on the parameters passed
    $scope.getFilters = function (type, id) {
        if (id && $scope.filters[type]) {
            return $scope.filters[type][id];
        }
        return $scope.filters[type];
    }

    //returns the filter from tempFilter with the given type and id
    $scope.getTempFilter = function (type, id) {
        if ($scope.tempFilters[type]) {
            return $scope.tempFilters[type][id];
        }
        return null;
    }

    //returns whether or not the given filter type supports selecting multiple filter options
    $scope.canSelectMultipleFilters = function (type) {
        switch (type) {
            case 'technology':
            case 'sector':
                return $scope.isLoggedIn();
            default:
                return false;
        }
    }

    //adds the specified filter to tempFilter if one doesn't currently exist, otherwise delete the filter from tempFilters
    $scope.setTempFilter = function (type, item) {
        if ($scope.canSelectMultipleFilters(type) && (item.type != "sector" || !item.countChildren)) {
            //If the filter type can support selection of multiple options then we need to track all selected options
            $scope.setMultipleFilter(type, item, true);
        } else {
            //otherwise if only single selection is allowed then we can clear the temp filter after every selection
            var alreadyChecked = false;
            if ($scope.tempFilters[type] && $scope.tempFilters[type][item.id]) {
                alreadyChecked = true;
            }
            $scope.resetTempFilters();
            if (!alreadyChecked) {
                $scope.setFilter(type, item, true);
            }
        }
    }

    //removes the specified filter from tempFilters
    $scope.removeTempFilter = function (type, id) {
        delete $scope.tempFilters[type][id];
        if ($.isEmptyObject($scope.tempFilters[type])) {
            delete $scope.tempFilters[type];
        }
    }

    //loads all filters for a given type into tempFilters
    $scope.prepTempFilters = function (type) {
        if ($scope.filters[type]) {
            $scope.tempFilters[type] = angular.copy($scope.filters[type]);
        }
    }

    //resets tempFilters to an empty object
    $scope.resetTempFilters = function () {
        $scope.tempFilters = {};
    }

    //removes the specified filter from the master filters model
    $scope.removeFilter = function (type, id) {
        delete $scope.filters[type][id];
        if ($.isEmptyObject($scope.filters[type])) {
            delete $scope.filters[type];
        }
        $scope.refreshProgramList();
    }

    $scope.getStateFilterAbbreviation = function () {
        if (!$scope.hasFilterOfType('state')) {
            return 'N/A';
        }
        return $scope.getFilters('state', $scope.getCurrentStateFilter())['abbreviation'];
    }

    $scope.getStateRSSLink = function () {
        if ($scope.hasFilterOfType('state')) {
            return $scope.subscribeToAllProgramsUrl + 'state/' + $scope.getCurrentStateFilter();
        }
        return '';
    }

    //returns true if there is a filter set for the given filter type
    $scope.hasFilterOfType = function (type, checkTempFilters) {
        if (checkTempFilters) {
            var filterCollection = $scope.tempFilters;
        } else {
            var filterCollection = $scope.filters;
        }
        return filterCollection[type] && !$.isEmptyObject(filterCollection[type]);
    }

    $scope.dateFilters = [];

    $scope.applyDateFilter = function (type) {
        var dateFilterObject = {};
        if($scope.dateFilters[type]) {
            var dateFilterString = ($scope.dateFilters[type].getMonth()+1)+'/'+$scope.dateFilters[type].getDate()+'/'+$scope.dateFilters[type].getFullYear();
            dateFilterObject[$scope.dateFilters[type].toDateString()] = {
                type: type,
                typeLabel: $scope.getFilterLabelForType(type),
                id: $scope.dateFilters[type].toDateString(),
                valueLabel: dateFilterString
            };
            $scope.filters[type] = angular.copy(dateFilterObject);
        } else {
            $scope.filters[type] = {};
        }
        $scope.refreshProgramList();
        $scope.closePanel.call($scope.flyoutMenu, 0);
    }

    //flushes the tempFilters into the master filter model for the given filter type
    $scope.applyFilters = function (type) {
        if ($scope.tempFilters[type] != $scope.filters[type]) {
            if ($scope.tempFilters[type]) {
                $scope.filters[type] = angular.copy($scope.tempFilters[type]);
            } else {
                delete $scope.filters[type];
            }
            $scope.refreshProgramList();
        }
        $scope.resetTempFilters();
        $scope.closePanel.call($scope.flyoutMenu, 0);
    };

    /**
     * updates the datatables implementation with a url with parameters for current filters and calls refresh on the table
     */
    $scope.refreshProgramList = function () {
        $scope.dtOptions.ajax.url = $scope.getProgramsUrlWithQueryParamsFromFilters();
        listService.refresh($scope);
    }

    /**
     * returns the url string to get all programs concatenated with query params for the current filters
     * @returns string url
     */
    $scope.getProgramsUrlWithQueryParamsFromFilters = function () {
        var url = $scope.restangularPrograms.getRequestedUrl();
        if ($scope.filters) {
            url += $scope.getQueryParamsFromFilters();
        }
        return url;
    }

    /**
     * returns a string of query parameters representing the currently stored filter options
     * @returns string
     */
    $scope.getQueryParamsFromFilters = function () {
        var params = '?';
        $.each($scope.filters, function (filterName, filters) {
            $.each(filters, function (filterValue, filterObject) {
                if (filterObject) {
                    params += filterName + '[]=' + filterValue + '&';
                }
            })
        });
        return params;
    }

    /*
    * -----------------------------------------------------------------------------------------------------------------
    * JS Functions to Govern the Display of Filter Panels
    * -----------------------------------------------------------------------------------------------------------------
    */

    //property to govern whether filters are hidden or not
    $scope.displayFilters = false;

    //show/hide filters
    $scope.toggleFiltersDisplay = function () {
        // $scope.displayFilters = !$scope.displayFilters;
        var $lastMenu = $('[data-level="1"]', $scope.flyoutMenu);

        $scope.flyoutMenu.addClass('active');
        $lastMenu.addClass('active');
        $('body').addClass('no-scroll');
        $scope.flyoutMenu.attr('data-level-active', 1);
        //

        $lastMenu.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function (e) {
                if (!$lastMenu.hasClass('active')) {
                    $scope.flyoutMenu.removeClass('active');
                    $('body').removeClass('no-scroll');
                }
            });
    };
    $scope.closeFilterPanel = function ($event) {
        $scope.closePanel.call($scope.flyoutMenu, $($event.currentTarget).parents('[data-level]').attr('data-level'));
    };

    $scope.flyoutEvents = function ($event) {
        if ($($event.target).hasClass('flyout-menu')) {
            $scope.closePanel.call($scope.flyoutMenu, 0);
        }
    };
    $scope.activatePanel = function ($event) {
        var nextOne = $($event.target).next('div');

        if (!$($event.target).parent().hasClass('close-btn')) {
            $scope.flyoutMenu.attr('data-level-active', nextOne.attr('data-level'));
            nextOne.addClass('active');
        }
    };
    $scope.closePanel = function (level) {
        if ($scope.flyoutMenu.attr('data-level-active') > level && level !== 0) {
            $('[data-level=' + (Number(level) + 1) + ']').removeClass('active');
            $('[data-level=' + (Number(level) + 2) + ']').removeClass('active');
            $scope.flyoutMenu.attr('data-level-active', level);
        }
        else if (level === 0) {
            $scope.flyoutMenu.find('[data-level]').removeClass('active');
            $scope.flyoutMenu.attr('data-level-active', (level));
        }
        else {
            $('[data-level=' + (Number(level)) + ']').removeClass('active');
            $scope.flyoutMenu.attr('data-level-active', (Number(level) - 1));
        }
    };

    //returns the panel property of item after setting the new panel's level to be one higher than the parent level
    $scope.getNextPanel = function (panel, item) {
        if (item.panel) {
            item.panel.level = panel.level + 1;
            item.panel.parent = panel;
            return item.panel;
        }
        return panel;
    }

    /*
    *-----------------------------------------------------------------------------------------------------------------
    * Index Controller's $on and $watch Expressions
    *-----------------------------------------------------------------------------------------------------------------
    */

    $scope.$on('event:dataTableLoaded', function (event, loadedDT) {
        $('.dataTables_wrapper').prepend($('.btn-filters'));
        $('.dataTables_wrapper').prepend($('.rss-feeds'));
    });

    //display the total number of programs returned after filtering programs
    $scope.$watch('recordsTotal', function (newVal, oldVal, scope) {
        if (newVal != oldVal) {
            if ($scope.hasFilters()) {
                scope.msgWrapperText = 'We\'ve found ' + newVal + ' programs that match your filters';
            } else {
                scope.msgWrapperText = 'Use the filter options to refine your search';
            }
        }
    })

    $scope.filterOptionContainerElement = null;
    //watch the function hasFilters() in order to add and remove class name to/from parent filter options div for custom hide/show
    $scope.$watch($scope.hasFilters, function (boolean) {
        if (!$scope.filterOptionContainerElement) {
            $scope.filterOptionContainerElement = $('#filter-options-container');
        }
        if (boolean) {
            $scope.filterOptionContainerElement.addClass('show-applied-filters');
        }
        else {
            $scope.filterOptionContainerElement.removeClass('show-applied-filters');
        }
    });

    /*
    *-----------------------------------------------------------------------------------------------------------------
    * "Class" Definitions for Filter Panels
    *-----------------------------------------------------------------------------------------------------------------
    */

    $scope.maxFiltersShown = 10;
    $scope.searchFilters = [];

    //parent panel object
    var Panel = function () {
        this.loaded = false;
        this.loading = false;
        this.template = 'filters';
        this.name = '';
        this.type = '';
        this.apiRoute = '';
        this.items = [];
        this.page = 0;
        this.limit = 10;
        this.meta = {};
        this.getLabel = function () {
            return 'Filter by ' + this.name
        };
        this.getSearchText = function () {
            return 'Search All ' + this.name + 's'
        };
        this.getErrorText = function () {
            return 'Unable to load ' + this.getApiRoute() + ' at this time.'
        };
        this.loadPanel = function (item) {
            $scope.prepTempFilters(this.type);
            if (!this.loaded) {
                item.panel = this;
                this.loadItems();
            }
        };
        this.loadItems = function (params) {
            if (this.abort) {
                this.aborting = true;
                this.abort.resolve();
            }
            this.loading = true;
            this.abort = $q.defer();
            params = this.handleParams(params);
            this.getRestangularObject(params, this.abort).then(angular.bind(this, function (response) {
                //processing on success
                this.loading = false;
                this.loaded = true;
                this.meta = response.meta;
                try {
                    this.loadItemsSuccess(response, params);
                } catch (e) {
                }
            }), angular.bind(this, function (result) {
                this.loading = false;
                if (!this.aborting) {
                    this.loadItemsFail(result, this.getErrorText());
                }
                this.aborting = false;
            }));
        };
        this.handleParams = function (params) {
           return $.extend({orderBy: 'name', orderDir: 'ASC'}, params);
        };
        this.getRestangularObject = function (params, abort) {
            return Restangular.all(this.getApiRoute()).withHttpConfig({timeout: abort.promise}).getList(params);
        };
        this.loadItemsSuccess = function (response, params) {
            Array.prototype.push.apply(this.items, response.data);
        };
        this.loadItemsFail = function (result, errorText) {
            alert.add(errorText);
        };
        this.loadMore = function () {
            if(!this.loading) {
                this.page = this.items.length;
                var params = {offset: this.page, limit: this.limit};
                if ($scope.searchFilters[this.type]) {
                    params['search[value]'] = $scope.searchFilters[this.type];
                }
                this.loadItems(params);
            }
        },
            this.updateFiltersFromSearch = function () {
                this.page = 0;
                this.items = {};
                this.loadItems({'search[value]': $scope.searchFilters[this.type]})
            };
        this.activatePanel = function ($event) {
            $scope.activatePanel($event);
        };
        this.addDisabledClass = function () {
            return false;
        };
        this.getApiRoute = function () {
            return this.apiRoute;
        };
    };

    //properties to track energy categories retrieved via the api
    var EnergyCategoriesPanel = function () {
        this.template = 'list';
        this.name = 'Technology';
        this.type = 'energycategory';
        this.apiRoute = 'energy-categories';
        this.getSearchText = function () {
            return 'Search All Energy Categories';
        };
        this.loadItemsSuccess = function (response, params) {
            Array.prototype.push.apply(this.items, $.map(response.data, function (object) {
                    return new TechnologyCategoriesPanel(object);
                })
            );
        };
    };
    EnergyCategoriesPanel.prototype = new Panel();

    //properties to track technology categories retrieved via the api
    var TechnologyCategoriesPanel = function (object) {
        this.template = 'list';
        this.name = 'Technology';
        this.type = 'technologycategory';
        this.selectAll = true;
        if(object) {
            this.id = object.id;
            this.name = object.name;
            this.items = [];
        }
        this.getApiRoute = function () {
            return 'energy-categories/' + this.id + '/technology-categories';
        };
        this.getSearchText = function () {
            return 'Search All Technology Categories';
        };
        this.loadItemsSuccess = function (response, params) {
            Array.prototype.push.apply(this.items, $.map(response.data, function (object) {
                    return new TechnologiesPanel(object);
                })
            );
        };
    };
    TechnologyCategoriesPanel.prototype = new Panel();

    //properties to track technology categories retrieved via the api
    var TechnologiesPanel = function (object) {
        this.template = 'filters';
        this.label = 'Filter by Technology';
        this.type = 'technology';
        this.selectAll = true;
        if(object) {
            this.id = object.id;
            this.name = object.name;
            this.items = [];
        }
        this.getApiRoute = function () {
            return 'energy-categories/technology-categories/' + this.id + '/technologies';
        },
            this.getSearchText = function () {
                return 'Search All Technologies';
            };
        this.addDisabledFilterClass = function () {
            return $scope.hasFilterOfType('technologycategory', true);
        };
        this.addDisabledClass = function () {
            return $scope.hasFilterOfType('energycategory', true);
        };
        this.activatePanel = function ($event) {
            if ($scope.hasFilterOfType('energycategory', true)) {
                $event.stopPropagation();
            } else {
                $scope.activatePanel($event);
            }
        };
    };
    TechnologiesPanel.prototype = new Panel();

    var DatePanel = function () {
        this.name = 'Date';
        this.loadPanel = function (item) {
            item.panel = {
                label: 'Filter by Date',
                template: 'list',
                items: [
                    new UpdatedDatePanel(),
                    new ExpirationDatePanel()
                ]
            }
        };
    };
    DatePanel.prototype = new Panel();

    var UpdatedDatePanel = function () {
        this.name = 'Updated Date';
        this.id = 'updated';
        this.loadPanel = function (item) {
            item.panel = {
                label: 'Choose From and To Dates',
                template: 'list',
                type: 'date',
                items: [
                    new FromDatePanel('updatedfrom'),
                    new ToDatePanel('updatedto')
                ]
            }
        };
    };
    UpdatedDatePanel.prototype = new Panel();

    var ExpirationDatePanel = function () {
        this.name = 'Expiration Date';
        this.id = 'expiration';
        this.loadPanel = function (item) {
            item.panel = {
                label: 'Choose From and To Dates',
                template: 'list',
                type: 'date',
                items: [
                    new FromDatePanel('expiredfrom'),
                    new ToDatePanel('expiredto')
                ]
            }
        };
    };
    ExpirationDatePanel.prototype = new Panel();

    var FromDatePanel = function (type) {
        this.name = 'From';
        this.id = 'from';
        this.loadPanel = function (item) {
            item.panel = {
                label: 'Choose a Date',
                template: 'date',
                type: type
            }
        }
    };
    FromDatePanel.prototype = new Panel();

    var ToDatePanel = function (type) {
        this.name = 'To';
        this.id = 'to';
        this.loadPanel = function (item) {
            item.panel = {
                label: 'Choose a Date',
                template: 'date',
                type: type
            }
        };
    };
    ToDatePanel.prototype = new Panel();

    //properties to track program categories retrieved via the api
    var CategoriesPanel = function () {
        this.template = 'filters';
        this.name = 'Categories';
        this.type = 'category';
        this.apiRoute = 'categories';
        this.getSearchText = function () {
            return 'Search All Categories';
        };
    };
    CategoriesPanel.prototype = new Panel();

    //properties to track program types retrieved via the api
    var ProgramTypesPanel = function () {
        this.template = 'filters';
        this.name = 'Program Type';
        this.type = 'type';
        this.apiRoute = 'types';
    };
    ProgramTypesPanel.prototype = new Panel();

    //properties to track implementing sectors retrieved via the api
    var ImplementingSectorsPanel = function () {
        this.template = 'filters';
        this.name = 'Implementing Sector';
        this.type = 'implementingsector';
        this.apiRoute = 'implementing-sectors';
    };
    ImplementingSectorsPanel.prototype = new Panel();

    //properties to track states retrieved via the api
    var StatesPanel = function () {
        this.template = 'filters';
        this.name = 'State';
        this.type = 'state';
        this.apiRoute = 'states';
    };
    StatesPanel.prototype = new Panel();

    var CoverageAreaPanel = function () {
        this.name = 'Coverage Area';
        this.loadPanel = function (item) {
            item.panel = {
                label: 'Filter by Coverage Area',
                template: 'list',
                items: [
                    new UtilitiesPanel(),
                    new CountiesPanel(),
                    new CitiesPanel(),
                    new ZipCodesPanel()
                ]
            }
        };
        this.addDisabledClass = function () {
            return !$scope.hasFilterOfType('state');
        };
        this.activatePanel = function ($event) {
            if ($scope.hasFilterOfType('state')) {
                $scope.activatePanel($event);
            } else {
                $event.stopPropagation();
            }
        };
        this.disabledLabel = ' - Requires State Filter';
    };
    CoverageAreaPanel.prototype = new Panel();

    $scope.implementingSectorsUtilityID = 3;
    //properties to track utilities retrieved via the api
    var UtilitiesPanel = function () {
        this.template = 'filters';
        this.name = 'Utility';
        this.type = 'utility';
        this.apiRoute = 'utilities';
        this.handleParams = function (params) {
            this.stateFilter = $scope.getCurrentStateFilter();
           return $.extend(params, {'state': this.stateFilter});
        };
        this.loadPanel = function (item) {
            $scope.prepTempFilters(this.type);
            if (this.stateFilter && this.stateFilter != $scope.getCurrentStateFilter()) {
                this.items = {};
                this.loaded = false;
            }
            if (!this.loaded) {
                item.panel = this;
                this.loadItems();
            }
        };
        this.getSearchText = function () {
            return 'Search All Utilities';
        };
        this.activatePanel = function ($event) {
            if (!$scope.hasFilterOfType('implementingsector') || $scope.getFilters('implementingsector', $scope.implementingSectorsUtilityID)) {
                $scope.activatePanel($event);
            } else {
                $event.stopPropagation();
            }
        };
        this.addDisabledClass = function () {
            return $scope.hasFilterOfType('implementingsector') && !$scope.getFilters('implementingsector', $scope.implementingSectorsUtilityID);
        };
        this.disabledLabel = ' - Incompatible Implementing Sector Filter';
    };
    UtilitiesPanel.prototype = new Panel();

    $scope.implementingSectorsLocalID = 2;
    //properties to track counties retrieved via the api
    var CountiesPanel = function () {
        this.template = 'filters';
        this.name = 'County';
        this.type = 'county';
        this.apiRoute = 'counties';
        this.getSearchText = function () {
            return 'Search All Counties';
        };
        this.handleParams = function (params) {
            this.stateFilter = $scope.getCurrentStateFilter();
           return $.extend(params, {'state': $scope.getCurrentStateFilter()});
        };
        this.loadPanel = function (item) {
            $scope.prepTempFilters(this.type);
            if(this.stateFilter && this.stateFilter != $scope.getCurrentStateFilter()) {
                this.items = {};
                this.loaded = false;
            }
            if (!this.loaded) {
                item.panel = this;
                this.loadItems();
            }
        },
        this.activatePanel = function ($event) {
            if (!$scope.hasFilterOfType('implementingsector') || $scope.getFilters('implementingsector', $scope.implementingSectorsLocalID)) {
                $scope.activatePanel($event);
            } else {
                $event.stopPropagation();
            }
        };
        this.addDisabledClass = function () {
            return $scope.hasFilterOfType('implementingsector') && !$scope.getFilters('implementingsector', $scope.implementingSectorsLocalID);
        };
        this.disabledLabel = ' - Incompatible Implementing Sector Filter';
    };
    CountiesPanel.prototype = new Panel();

    //properties to track cities retrieved via the api
    var CitiesPanel = function () {
        this.template = 'filters';
        this.name = 'Cities';
        this.type = 'city';
        this.apiRoute = 'cities';
        this.getSearchText = function () {
            return 'Search All Cities';
        };
        this.handleParams = function (params) {
            this.stateFilter = $scope.getCurrentStateFilter();
           return $.extend(params, {'state': $scope.getCurrentStateFilter()});
        };
        this.loadPanel = function (item) {
            $scope.prepTempFilters(this.type);
            if(this.stateFilter && this.stateFilter != $scope.getCurrentStateFilter()) {
                this.items = {};
                this.loaded = false;
            }
            if (!this.loaded) {
                item.panel = this;
                this.loadItems();
            }
        },
        this.activatePanel = function ($event) {
            if (!$scope.hasFilterOfType('implementingsector') || $scope.getFilters('implementingsector', $scope.implementingSectorsLocalID)) {
                $scope.activatePanel($event);
            } else {
                $event.stopPropagation();
            }
        };
        this.addDisabledClass = function () {
            return $scope.hasFilterOfType('implementingsector') && !$scope.getFilters('implementingsector', $scope.implementingSectorsLocalID);
        };
        this.disabledLabel = ' - Incompatible Implementing Sector Filter';
    };
    CitiesPanel.prototype = new Panel();

    //properties to track zip codes retrieved via the api
    var ZipCodesPanel = function () {
        this.template = 'filters';
        this.name = 'Zip Code';
        this.type = 'zipcode';
        this.apiRoute = 'zip-codes';
        this.loadPanel = function (item) {
            $scope.prepTempFilters(this.type);
            if (this.stateFilter && this.stateFilter != $scope.getCurrentStateFilter()) {
                this.items = {};
                this.loaded = false;
            }
            if (!this.loaded) {
                item.panel = this;
                this.loadItems();
            }
        };
        this.handleParams = function (params) {
            this.stateFilter = $scope.getCurrentStateFilter();
           return $.extend(params, {'state': $scope.getCurrentStateFilter()});
        };
        this.activatePanel = function ($event) {
            if (!$scope.hasFilterOfType('implementingsector') || $scope.getFilters('implementingsector', $scope.implementingSectorsLocalID) || $scope.getFilters('implementingsector', $scope.implementingSectorsUtilityID)) {
                $scope.activatePanel($event);
            } else {
                $event.stopPropagation();
            }
        };
        this.addDisabledClass = function () {
            return $scope.hasFilterOfType('implementingsector') && !$scope.getFilters('implementingsector', $scope.implementingSectorsLocalID) && !$scope.getFilters('implementingsector', $scope.implementingSectorsUtilityID);
        };
        this.disabledLabel = ' - Incompatible Implementing Sector Filter';
    };
    ZipCodesPanel.prototype = new Panel();

    //properties to track eligible sectors retrieved via the api
    var EligibleSectorsPanel = function (object) {
        this.template = 'list';
        this.name = 'Eligible Sector';
        this.type = 'sector';
        this.id = '';
        if(object) {
            this.id = object.id;
            this.name = object.name;
            this.countChildren = object.countChildren;
            this.items = [];
        }
        this.apiRoute = 'sectors';
        this.handleParams = function (params) {
           return $.extend(params, {parentId: this.id});
        };
        this.loadItemsSuccess = function (response, params) {
            Array.prototype.push.apply(this.items, $.map(response.data, angular.bind(this, function (object) {
                        //if panel has no children then use 'filters' template
                        if (!object.countChildren) {
                            this.template = 'filters';
                            this.addDisabledFilterClass = function () {
                                return $scope.getTempFilter('sector', this.parent.id);
                            }
                        }
                        //if not the top parent panel then add select All option
                        if (this.id) {
                            this.selectAll = true;
                        }
                        //return the item as another level in the sectors hierarchy
                        return new EligibleSectorsPanel(object);;
                    }))
            );
        };
        this.addDisabledClass = function () {
            return $scope.getTempFilter('sector', this.parentId);
        };
        this.activatePanel = function ($event) {
            if (!$scope.getTempFilter('sector', this.parentId)) {
                $scope.activatePanel($event);
            } else {
                $event.stopPropagation();
            }
        };
    };
    EligibleSectorsPanel.prototype = new Panel();

    var FromSirPanel = function () {
        this.loaded = true;
        this.template = 'boolean';
        this.name = 'From SIR';
        this.type = 'fromSir';
        this.items = [
            { id: 0, name: 'Disabled', label: 'Excluding SIR Programs' },
            { id: 1, name: 'Enabled',  label: 'SIR Programs Only' }
        ];
        this.loadPanel = function (item) {
            $scope.prepTempFilters(this.type);
            item.panel = this;
        };
    };
    FromSirPanel.prototype = new Panel();

    var ActivePanel = function () {
        this.name = 'Initial Panel';
        this.template = 'list';
        this.level = 1;
        this.items = [
            new EnergyCategoriesPanel(),
            new DatePanel(),
            new CategoriesPanel(),
            new ProgramTypesPanel(),
            new ImplementingSectorsPanel(),
            new StatesPanel(),
            new CoverageAreaPanel(),
            new EligibleSectorsPanel(),
            new FromSirPanel()
        ];
    };
    ActivePanel.prototype = new Panel();
    //instantiate top level panel to be accessed by angular in index.phtml template file
    $scope.panel = new ActivePanel();
}]);
