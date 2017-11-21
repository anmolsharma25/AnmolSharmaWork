'use strict'

module.exports = /* @ngInject */ function (
	$scope, 
	$location, 
	$timeout, 
	Enums, 
	SiteService,
	dialogs, 
	$loading, 
	toastr, 
	ReportingService, 
	$translate)
{
	var vm = this
	vm.name = 'OpenLoansCountReportController'

	vm.openLoansCountReportResultDto = []
	vm.openLoansCountRequestDto = 
	{
		regionId: null,
		districtId: null,
		dealerId: null,
		model:null,
		oemId: null,
		isNational: false,
		regionIds: [],
		regionDistrictIds: [],
		districtDealerIds: [],
		reportFocusTypeId: null
	}
	vm.isExpandabe = true
	vm.totalLoansRegionIds = []
	vm.noResultsVisibility = 'hidden'
	vm.noRegionAssigned = 'hidden'
	vm.gridVisibility = 'visible'

	vm.getOpenLoansCountByRegion = function(openLoan)
	{        
		if (!openLoan.isCollapsed)
		{
			vm.openLoansCountRequestDto.regionId = openLoan.regionID
			vm.openLoansCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Districts

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLoansCountReport(vm.openLoansCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLoan.regionID
							vm.openLoansCountReportResultDto.splice((vm.openLoansCountReportResultDto.indexOf(openLoan) + index + 1), 0, item)
						})
					}

					if (vm.isExpandabe)
					{
						if (typeof vm.openLoansCountRequestDto.districtDealerIds !== 'undefined' &&
							vm.openLoansCountRequestDto.districtDealerIds.length > 0)
						{
							vm.openLoansCountReportResultDto[1].isCollapsed = false
							vm.getOpenLoansCountByDistrict(vm.openLoansCountReportResultDto[1])
							vm.isExpandabe = false
						}
					}
				})
				.catch(function(result)
				{
					$loading.finish('viewHost')
					if (result.status === 401)
					{
						SiteService.updateLoginSession(result.data)
					}
					else
					{
						toastr.error($translate.instant('RPT_ERR_RETRIEVING_REPORT') + ' ' + result.data.errorMessage)
					}
				})
		}
		else
		{            
			for (var i = vm.openLoansCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if (vm.openLoansCountReportResultDto[i].parentRegionID == openLoan.regionID)
				{
					vm.openLoansCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLoansCountRequestDto()
	}

	vm.getOpenLoansCountByDistrict = function(openLoan)
	{        
		if (!openLoan.isCollapsed)
		{
			vm.openLoansCountRequestDto.regionId = openLoan.parentRegionID
			vm.openLoansCountRequestDto.districtId = openLoan.districtID
			vm.openLoansCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Dealers

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLoansCountReport(vm.openLoansCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLoan.parentRegionID
							item.parentDistrictID = openLoan.districtID
							vm.openLoansCountReportResultDto.splice((vm.openLoansCountReportResultDto.indexOf(openLoan) + index + 1), 0, item)
						})
					}
				})
				.catch(function(result)
				{
					$loading.finish('viewHost')
					if (result.status === 401)
					{
						SiteService.updateLoginSession(result.data)
					}
					else
					{
						toastr.error($translate.instant('RPT_ERR_RETRIEVING_REPORT') + ' ' + result.data.errorMessage)
					}
				})
		}
		else
		{
			for (var i = vm.openLoansCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if ((vm.openLoansCountReportResultDto[i].parentRegionID == openLoan.parentRegionID) &&
					(vm.openLoansCountReportResultDto[i].parentDistrictID == openLoan.districtID))
				{
					vm.openLoansCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLoansCountRequestDto()
	}

	vm.getOpenLoansCountByDealer = function(openLoan)
	{        
		if (!openLoan.isCollapsed)
		{
			vm.openLoansCountRequestDto.regionId = openLoan.parentRegionID
			vm.openLoansCountRequestDto.districtId = openLoan.parentDistrictID
			vm.openLoansCountRequestDto.dealerId = openLoan.dealerID
			vm.openLoansCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Models

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLoansCountReport(vm.openLoansCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLoan.parentRegionID
							item.parentDistrictID = openLoan.parentDistrictID
							item.parentDealerID = openLoan.dealerID
							vm.openLoansCountReportResultDto.splice((vm.openLoansCountReportResultDto.indexOf(openLoan) + index + 1), 0, item)
						})
					}
				})
				.catch(function(result)
				{
					$loading.finish('viewHost')
					if (result.status === 401)
					{
						SiteService.updateLoginSession(result.data)
					}
					else
					{
						toastr.error($translate.instant('RPT_ERR_RETRIEVING_REPORT') + ' ' + result.data.errorMessage)
					}
				})
		}
		else
		{
			for (var i = vm.openLoansCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if (vm.openLoansCountReportResultDto[i].parentRegionID == openLoan.parentRegionID && 
					vm.openLoansCountReportResultDto[i].parentDistrictID == openLoan.parentDistrictID &&
					vm.openLoansCountReportResultDto[i].parentDealerID == openLoan.dealerID)
				{
					vm.openLoansCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLoansCountRequestDto()
	}

	vm.getOpenLoansCountByModel = function(openLoan)
	{        
		if (!openLoan.isCollapsed)
		{            
			vm.openLoansCountRequestDto.regionId = openLoan.parentRegionID
			vm.openLoansCountRequestDto.districtId = openLoan.parentDistrictID
			vm.openLoansCountRequestDto.dealerId = openLoan.parentDealerID
			vm.openLoansCountRequestDto.model = openLoan.model
			vm.openLoansCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.ModelYears

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLoansCountReport(vm.openLoansCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLoan.parentRegionID
							item.parentDistrictID = openLoan.parentDistrictID
							item.parentDealerID = openLoan.parentDealerID
							item.parentModel = openLoan.model
							vm.openLoansCountReportResultDto.splice((vm.openLoansCountReportResultDto.indexOf(openLoan) + index + 1), 0, item)
						})
					}
				})
				.catch(function(result)
				{
					$loading.finish('viewHost')
					if (result.status === 401)
					{
						SiteService.updateLoginSession(result.data)
					}
					else
					{
						toastr.error($translate.instant('RPT_ERR_RETRIEVING_REPORT') + ' ' + result.data.errorMessage)
					}
				})
		}
		else
		{
			for (var i = vm.openLoansCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if (vm.openLoansCountReportResultDto[i].parentRegionID == openLoan.parentRegionID && 
					vm.openLoansCountReportResultDto[i].parentDistrictID == openLoan.parentDistrictID &&
					vm.openLoansCountReportResultDto[i].parentDealerID == openLoan.parentDealerID &&
					vm.openLoansCountReportResultDto[i].parentModel == openLoan.model)
				{
					vm.openLoansCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLoansCountRequestDto()
	}

	vm.getOpenLoansCountReport = function()
	{
		$timeout(function()
		{
			$loading.start('viewHost')
		}, 100)

		ReportingService
			.retrieveOpenLoansCountReport(vm.openLoansCountRequestDto)
			.then(function(result)
			{
				$loading.finish('viewHost')
				vm.openLoansCountReportResultDto = result.data.actionResult
				vm.noResultsVisibility = (vm.openLoansCountReportResultDto.length == 0) ? 'visible' : 'hidden'
				vm.gridVisibility = (vm.openLoansCountReportResultDto.length > 0) ? 'visible' : 'hidden'
				if (vm.openLoansCountReportResultDto.length > 0)
				{
					vm.openLoansCountReportResultDto.forEach(function(item)
					{
						item.isCollapsed = true
					})

					if (vm.isExpandabe)
					{
						if (typeof vm.openLoansCountRequestDto.regionDistrictIds !== 'undefined' &&
							vm.openLoansCountRequestDto.regionDistrictIds.length > 0)
						{
							vm.openLoansCountReportResultDto[0].isCollapsed = false
							vm.getOpenLoansCountByRegion(vm.openLoansCountReportResultDto[0])

							if (vm.openLoansCountRequestDto.districtDealerIds.length == 0)
							{
								vm.isExpandabe = false
							}
						}
					}
				}
			})
			.catch(function(result)
			{
				$loading.finish('viewHost')
				if (result.status === 401)
				{
					SiteService.updateLoginSession(result.data)
				}
				else
				{
					toastr.error($translate.instant('RPT_ERR_RETRIEVING_REPORT') + ' ' + result.data.errorMessage)
				}
			})

		vm.resetOpenLoansCountRequestDto()
	}

	vm.resetOpenLoansCountRequestDto = function()
	{  
		vm.openLoansCountRequestDto.regionId = null
		vm.openLoansCountRequestDto.districtId = null
		vm.openLoansCountRequestDto.dealerId = null
		vm.openLoansCountRequestDto.model = null   
	}

	vm.downloadResults = function()
	{
		if (vm.openLoansCountReportResultDto != undefined)
		{
			SiteService.dataExportResponse = vm.convertToCSV(JSON.stringify(vm.openLoansCountReportResultDto))
			vm.downloadDialog()
		}
	}

	vm.convertToCSV = function(JSONData) 
	{
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData
		var csvdata = []
		var topHeading = ',,,,,Loan Maturity in x Months,'        
		var mainHeading = 'Region,District,Dealer,Model,Year,1,2,3,4,5,6,12,18,24,36,48,60,Total Loans'
		csvdata.push(topHeading)
		csvdata.push(mainHeading)

		for (var i = 0; i < arrData.length; i++) 
		{
			var row = ''            
			row = 
				(arrData[i]['regionName'] == null ? '' : '="' + arrData[i]['regionName'] + '"') + ',' +
				(arrData[i]['districtID'] == null ? '' : '="' + arrData[i]['districtName'] + '"') + ',' +
				(arrData[i]['dealerName'] == null ? '' : '="' + arrData[i]['dealerName'] + '"') + ',' +
				(arrData[i]['model'] == null ? '' : '="' + arrData[i]['model'] + '"') + ',' +
				(arrData[i]['year'] == null ? '' : '="' + arrData[i]['year'] + '"') + ',' +
				(arrData[i]['month1'] == null ? '' : '="' + arrData[i]['month1'] + '"') + ',' +
				(arrData[i]['month2'] == null ? '' : '="' + arrData[i]['month2'] + '"') + ',' +
				(arrData[i]['month3'] == null ? '' : '="' + arrData[i]['month3'] + '"') + ',' +
				(arrData[i]['month4'] == null ? '' : '="' + arrData[i]['month4'] + '"') + ',' +
				(arrData[i]['month5'] == null ? '' : '="' + arrData[i]['month5'] + '"') + ',' +
				(arrData[i]['month6'] == null ? '' : '="' + arrData[i]['month6'] + '"') + ',' +
				(arrData[i]['month12'] == null ? '' : '="' + arrData[i]['month12'] + '"') + ',' +
				(arrData[i]['month18'] == null ? '' : '="' + arrData[i]['month18'] + '"') + ',' +
				(arrData[i]['month24'] == null ? '' : '="' + arrData[i]['month24'] + '"') + ',' +
				(arrData[i]['month36'] == null ? '' : '="' + arrData[i]['month36'] + '"') + ',' +
				(arrData[i]['month48'] == null ? '' : '="' + arrData[i]['month48'] + '"') + ',' +
				(arrData[i]['month60'] == null ? '' : '="' + arrData[i]['month60'] + '"') + ',' +
				(arrData[i]['totalLoans'] == null ? '' : '="' + arrData[i]['totalLoans'] + '"')

			csvdata.push(row)
		}

		var dataExportResponseDto = 
		{
			fileData: csvdata,
			fileName: 'OpenLoanCountReport.csv',
			filePath: '',
			fileSize: 0
		}

		return dataExportResponseDto
	}

	vm.refreshPageCollection = function()
	{
		if (SiteService.loginSession.user.oemUserRegions && 
			SiteService.loginSession.user.oemUserRegions.length > 0)
		{
			vm.initializeReportRequest()
		}
		else
		{
			vm.noRegionAssigned = 'visible'
			vm.gridVisibility = 'hidden'
		}
	}

	vm.downloadDialog = function()
	{
		var dlg = dialogs.create('/dist/dialogs/file-download/file-download.html', 'FileDownloadController', {}, {}, 'vm')
		dlg.result
			.then(
				function(){},
				function(){}
			)
	}

	vm.initializeReportRequest = function()
	{
		switch (SiteService.userGroupId())
		{
			case Enums.userGroups.Dealers:
				vm.attachRegionsDistrictsDealers()
				break
			case Enums.userGroups.OEMs:
				if (SiteService.isInRoles([Enums.userRoles.DistrictManager, Enums.userRoles.RegionalManager, Enums.userRoles.NationalManager]))
				{
					vm.attachRegionsDistrictsDealers()
				}
				break
		}

		if (SiteService.viewParameters.countReport)
		{
			vm.openLoansCountReportResultDto = SiteService.viewParameters.countReport
			SiteService.viewParameters.countReport = null
			vm.resetOpenLoansCountRequestDto()
			vm.isExpandabe = false
		}
		else
		{			
			vm.getOpenLoansCountReport()			
		}
	}

	vm.attachRegionsDistrictsDealers = function()
	{
		vm.openLoansCountRequestDto.oemId = SiteService.loginSession.user.oemId

		if ((SiteService.userGroupId() == Enums.userGroups.OEMs) &&
		(SiteService.isInRoles([Enums.userRoles.RegionalManager])))
		{
			vm.openLoansCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Region
		}

		SiteService.loginSession.user.oemUserRegions.forEach(function(region)
		{			
			vm.openLoansCountRequestDto.regionIds.push(region.businessRegionId)
			vm.totalLoansRegionIds.push(region.businessRegionId)

			if ((SiteService.userGroupId() == Enums.userGroups.Dealers) ||
				(SiteService.isInRoles([Enums.userRoles.DistrictManager])))
			{
				if (region.oemUserDistricts)
				{
					vm.openLoansCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.District

					region.oemUserDistricts.forEach(function(district)
					{                        
						if (district.businessRegionId == region.businessRegionId)
						{
							vm.openLoansCountRequestDto.regionDistrictIds.push(district.businessDistrictId)

							if (district.dealers)
							{
								vm.openLoansCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Dealer

								district.dealers.forEach(function(dealer)
								{
									if (dealer.businessDistrictId == district.businessDistrictId)
									{
										vm.openLoansCountRequestDto.districtDealerIds.push(dealer.dealerId)
									}
								})
							}
						}
					})
				}
			}
		})
		
		if ((SiteService.userGroupId() == Enums.userGroups.OEMs) &&
			(SiteService.isInRoles([Enums.userRoles.NationalManager])))
		{
			vm.openLoansCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Nation

			if (SiteService.viewParameters.businessRegions && 
				SiteService.viewParameters.businessRegions.length > 0)
			{
				vm.openLoansCountRequestDto.regionIds = []
				vm.totalLoansRegionIds = []
				vm.openLoansCountRequestDto.isNational = true

				SiteService.viewParameters.businessRegions
					.forEach(function(businessRegion)
					{
						vm.openLoansCountRequestDto.regionIds.push(businessRegion.businessRegionId)
						vm.totalLoansRegionIds.push(businessRegion.businessRegionId)
					})
			}
		}
	}

	vm.getPortfoliosByMonth = function(eotMonth)
	{
		vm.portfolioSearchRequest.isAccountActive = true
		vm.portfolioSearchRequest.isValidModel = true
		vm.portfolioSearchRequest.financeContractTypeId = Enums.financeContractTypes.Loan
		vm.portfolioSearchRequest.oemIds.push(vm.openLoansCountRequestDto.oemId)

		if (eotMonth.openLoan.regionName)
		{
			if (eotMonth.openLoan.regionName != 'Total' && 
				eotMonth.openLoan.regionName != 'Terminated Dealers' && 
				eotMonth.openLoan.regionID)
			{
				vm.portfolioSearchRequest.regionIds.push(eotMonth.openLoan.regionID)

				if (vm.openLoansCountRequestDto.regionDistrictIds && 
					vm.openLoansCountRequestDto.regionDistrictIds.length > 0)
				{
					vm.portfolioSearchRequest.districtIds = vm.openLoansCountRequestDto.regionDistrictIds
				}
				if (vm.openLoansCountRequestDto.districtDealerIds && 
					vm.openLoansCountRequestDto.districtDealerIds.length > 0)
				{
					vm.portfolioSearchRequest.dealerIds = vm.openLoansCountRequestDto.districtDealerIds
				}
			}
			else if (eotMonth.openLoan.regionName == 'Total')
			{
				if ((SiteService.userGroupId() == Enums.userGroups.OEMs) &&
					(SiteService.isInRoles([Enums.userRoles.NationalManager])))
				{
					vm.portfolioSearchRequest.regionIds = []
					vm.portfolioSearchRequest.districtIds = []
					vm.portfolioSearchRequest.dealerIds = []
				} 
				else
				{              
					vm.portfolioSearchRequest.regionIds = vm.totalLoansRegionIds
					
					if (vm.openLoansCountRequestDto.regionDistrictIds &&
						vm.openLoansCountRequestDto.regionDistrictIds.length > 0)
					{
						vm.portfolioSearchRequest.districtIds = vm.openLoansCountRequestDto.regionDistrictIds
					}
					if (vm.openLoansCountRequestDto.districtDealerIds &&
						vm.openLoansCountRequestDto.districtDealerIds.length > 0)
					{
						vm.portfolioSearchRequest.dealerIds = vm.openLoansCountRequestDto.districtDealerIds
					}  
				}                             
			}
			else if (eotMonth.openLoan.regionName == 'Terminated Dealers')
			{                
				vm.portfolioSearchRequest.regionIds = []
				vm.portfolioSearchRequest.districtIds = []
				vm.portfolioSearchRequest.dealerIds = []
				vm.portfolioSearchRequest.isTerminatedDealer = true
			}
		}
		else if (eotMonth.openLoan.districtID)
		{
			vm.portfolioSearchRequest.districtIds.push(eotMonth.openLoan.districtID)
			vm.portfolioSearchRequest.regionIds.push(eotMonth.openLoan.parentRegionID)

			if (vm.openLoansCountRequestDto.districtDealerIds && 
				vm.openLoansCountRequestDto.districtDealerIds.length > 0)
			{
				vm.portfolioSearchRequest.dealerIds = vm.openLoansCountRequestDto.districtDealerIds
			}
		}
		else if (eotMonth.openLoan.dealerID)
		{
			vm.portfolioSearchRequest.dealerIds.push(eotMonth.openLoan.dealerID)
			vm.portfolioSearchRequest.districtIds.push(eotMonth.openLoan.parentDistrictID)
			vm.portfolioSearchRequest.regionIds.push(eotMonth.openLoan.parentRegionID)
		}
		else if (eotMonth.openLoan.model)
		{
			vm.portfolioSearchRequest.vehicleModel = eotMonth.openLoan.model
			vm.portfolioSearchRequest.dealerIds.push(eotMonth.openLoan.parentDealerID)
			vm.portfolioSearchRequest.districtIds.push(eotMonth.openLoan.parentDistrictID)
			vm.portfolioSearchRequest.regionIds.push(eotMonth.openLoan.parentRegionID)
		}
		else if (eotMonth.openLoan.year)
		{
			vm.portfolioSearchRequest.vehicleYear = eotMonth.openLoan.year
			vm.portfolioSearchRequest.vehicleModel = eotMonth.openLoan.parentModel
			vm.portfolioSearchRequest.dealerIds.push(eotMonth.openLoan.parentDealerID)
			vm.portfolioSearchRequest.districtIds.push(eotMonth.openLoan.parentDistrictID)
			vm.portfolioSearchRequest.regionIds.push(eotMonth.openLoan.parentRegionID)
		}

		vm.calculatePortfolioMaturityDate(eotMonth)        

		SiteService.viewParameters.portfolioList = {}
		SiteService.viewParameters.countReport = {}
		SiteService.viewParameters.portfolioList.backPageURL = 'open-contract-count/openLoanCountReporting'

		SiteService.viewParameters.countReport = vm.openLoansCountReportResultDto
		SiteService.viewParameters.portfolioList.titleType = Enums.searchResultTitleTypes.OpenLoanCountReport
		SiteService.viewParameters.portfolioList.searchParameters = vm.portfolioSearchRequest
		$location.path('/portfolioList')

	}

	vm.calculatePortfolioMaturityDate = function(eotMonth)
	{
		var mStart = new Date()
		var mStop = new Date()

		if (eotMonth.month1 > 0)
		{
			mStart.setMonth(mStart.getMonth() + 0)
			mStop.setMonth(mStop.getMonth() + 1)
		}
		else if (eotMonth.month2)
		{
			mStart.setMonth(mStart.getMonth() + 1)
			mStop.setMonth(mStop.getMonth() + 2)
		}
		else if (eotMonth.month3)
		{
			mStart.setMonth(mStart.getMonth() + 2)
			mStop.setMonth(mStop.getMonth() + 3)
		}
		else if (eotMonth.month4)
		{
			mStart.setMonth(mStart.getMonth() + 3)
			mStop.setMonth(mStop.getMonth() + 4)
		}
		else if (eotMonth.month5)
		{
			mStart.setMonth(mStart.getMonth() + 4)
			mStop.setMonth(mStop.getMonth() + 5)
		}
		else if (eotMonth.month6)
		{
			mStart.setMonth(mStart.getMonth() + 5)
			mStop.setMonth(mStop.getMonth() + 6)
		}
		else if (eotMonth.month12)
		{
			mStart.setMonth(mStart.getMonth() + 6)
			mStop.setMonth(mStop.getMonth() + 12)
		}
		else if (eotMonth.month18)
		{
			mStart.setMonth(mStart.getMonth() + 12)
			mStop.setMonth(mStop.getMonth() + 18)
		}
		else if (eotMonth.month24)
		{
			mStart.setMonth(mStart.getMonth() + 18)
			mStop.setMonth(mStop.getMonth() + 24)
		}
		else if (eotMonth.month36)
		{
			mStart.setMonth(mStart.getMonth() + 24)
			mStop.setMonth(mStop.getMonth() + 36)
		}
		else if (eotMonth.month48)
		{
			mStart.setMonth(mStart.getMonth() + 36)
			mStop.setMonth(mStop.getMonth() + 48)
		}
		else if (eotMonth.month60)
		{
			mStart.setMonth(mStart.getMonth() + 48)
			mStop.setMonth(mStop.getMonth() + 60)
		}
		else if (eotMonth.totalLoans)
		{
			mStart.setMonth(mStart.getMonth() + 0)
			mStop.setMonth(mStop.getMonth() + 60)
		}

		vm.portfolioSearchRequest.maturityDateStart = mStart
		vm.portfolioSearchRequest.maturityDateStop = mStop
	}

	$scope.$on('refreshPageCollection', function ()
	{
		vm.refreshPageCollection()
	})

	$scope.$on('downloadResults', function ()
	{
		vm.downloadResults()
	})

	activate()
	function activate()
	{
		$scope.$emit('viewLoaded', {})

		if ((SiteService.loginSession.user.userId != undefined) && (SiteService.loginSession.user.userId > 0))
		{
			vm.portfolioSearchRequest = SiteService.instantiatePortfolioSearchParameters()

			$timeout(function()
			{
				$scope.$emit('onContractReportChanged', { reportTypeId: 2 })
			}, 100)

			if (SiteService.loginSession.user.oemUserRegions && 
				SiteService.loginSession.user.oemUserRegions.length > 0)
			{
				vm.initializeReportRequest()
			}
			else
			{
				vm.noRegionAssigned = 'visible'
				vm.gridVisibility = 'hidden'
			}
		}
	}
}