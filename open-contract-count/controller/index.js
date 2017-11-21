'use strict'

module.exports = /* @ngInject */ function ($scope, $rootScope, $location, $timeout, LeaseService, SiteService, $loading, dialogs, toastr, Enums, $translate)
{
	var vm = this    
	vm.name = 'OpenContractCountController'

	vm.reportTypes =
	{
		Lease: 1,
		Loan: 2
	}

	vm.selectableReportTypes = undefined
	vm.selectedReportType = undefined

	vm.initializeReportTypes = function()
	{
		vm.selectableReportTypes = []

		vm.selectableReportTypes.push({
			reportTypeId: vm.reportTypes.Lease,
			name: $translate.instant('RPT_MAIN_NAVOPENLEASE')
		})

		vm.selectableReportTypes.push({
			reportTypeId: vm.reportTypes.Loan,
			name: $translate.instant('RPT_MAIN_NAVOPENLOAN')
		})
	}

	vm.onReportTypeSelected = function()
	{
		switch (vm.selectedReportType.reportTypeId)
		{
			case vm.reportTypes.Lease:
				$location.path('open-contract-count/openLeaseCountReporting')
				break
			case vm.reportTypes.Loan:
				$location.path('open-contract-count/openLoanCountReporting')
				break
		}
	}

	vm.goBack = function()
	{
		switch (SiteService.userGroupId())
		{
			case Enums.userGroups.Dealers:
				vm.backPageURL = 'dealerReporting'
				break
			case Enums.userGroups.OEMs:
				vm.backPageURL = 'oemReporting'
				break
		}

		$location.path(vm.backPageURL)
	}

	vm.refreshPageCollection = function()
	{
		$scope.$broadcast('refreshPageCollection', {})
	}

	vm.downloadResults = function()
	{
		$scope.$broadcast('downloadResults', {})
	}

	$scope.$on('onContractReportChanged', function (event, args)
	{
		for (var i = 0; i < vm.selectableReportTypes.length; i++)
		{
			if (vm.selectableReportTypes[i].reportTypeId == args.reportTypeId)
			{
				vm.selectedReportType = vm.selectableReportTypes[i]
				break
			}
		}
	})

	activate()
	function activate()
	{
		$scope.$emit('viewLoaded', {})

		if ((SiteService.loginSession.user.userId != undefined) && (SiteService.loginSession.user.userId > 0))
		{
			vm.initializeReportTypes()
		}
	}
}