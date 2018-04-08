angular.module('ncsolar').service('listService', ["DTOptionsBuilder", "DTColumnBuilder", function(DTOptionsBuilder, DTColumnBuilder) {
    return {
        /**
         * Takes an angular scope object, a Restangular endpoint object and an optional options array
         * Sets up the basic environment for a datatable request.
         * @param scope
         * @param restObj
         * @param options (optional)
         */
        attachTo: function(scope, restObj) {
            var options = angular.extend({}, {
                // TODO: add options as needed
                fnData: function(dtData) {
                    return dtData;
                },
                fnDataSrc: angular.bind(scope, function(json) {
                    this.recordsTotal = json.recordsTotal;
                    this.$apply();
                    return json.data;
                }),
                fnClick: function(tr, data, index, displayIndex) {

                },
                url: restObj.getRestangularUrl()
            }, arguments[2] || {});
            scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    // Either you specify the AjaxDataProp here
                    // dataSrc: 'data',
                    url: options.url,
                    type: 'GET',
                    data: options.fnData,
                    dataSrc: options.fnDataSrc
                })
                // or here
                .withDataProp('data')
                .withOption('serverSide', true)
                .withOption('processing', true)
                .withDOM('l<"dt-filter-fix: exp;"f>rtip')//default: 'lfrtip' read more: http://datatables.net/reference/option/dom
                .withOption('headerCallback', function(thead, data, start, end, display) {
                    $(thead).find('th').each(function(index, th) {
                        $(th).html('<span>'+$(th).text()+'</span>')
                    });
                })
                .withOption('order', options.order || [0, 'asc'])
                .withOption('aLengthMenu', options.lengthMenu || [10,25,50,100])
                .withDisplayLength(options.displayLength || 10)
                .withPaginationType('full_numbers')
                .withOption('rowCallback', function(tr, data, index, displayIndex) {
                    $(tr).find('td').click(function(ev) {
                        options.fnClick(tr, data, index, displayIndex, ev);
                    })
                });
            scope.$on('event:dataTableLoaded', function(event, params) {
                // get the wrapper
                var container = $(params.dataTable[0]).parent();
                var searchBox = container.find('.dataTables_filter input');
                searchBox.each(function(i, box) {
                    var label = $(box).parent();
                    // move it to sibling of current parent
                    label.after(box);
                    // delete parent
                    label.remove();
                    $(box).attr('placeholder', 'Search...');
                })
            })
            if (options.columns && angular.isArray(options.columns)) {
                var cols = [];
                angular.forEach(options.columns, function(colData, index) {
                    var column = DTColumnBuilder.newColumn(colData.property).withTitle(colData.label);
                    if (colData.render) {
                        column.renderWith(colData.render);
                    }
                    if (colData.notsortable) {
                        column.notSortable();
                    }
                    if (colData.notVisible) {
                        column.notVisible();
                    }
                    cols.push(column);
                });
                scope.dtColumns = cols;
            }
            //listen for change to table length
            scope.$on('event:dataTableLengthChanged', function(event, objects) {
                objects.table.page(0);
                scope.dtOptions.reloadData();
            });
        },
        refresh: function(scope) {
            scope.dtOptions.reloadData();
        }
    }
}]);
