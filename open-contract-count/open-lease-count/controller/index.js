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
	vm.name = 'OpenLeasesCountReportController'

	vm.openLeasesCountReportResultDto = []
	vm.openLeasesCountRequestDto = 
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
	vm.totalLeasesRegionIds = []
	vm.noResultsVisibility = 'hidden'
	vm.noRegionAssigned = 'hidden'
	vm.gridVisibility = 'visible'

	vm.getOpenLeasesCountByRegion = function(openLease)
	{        
		if (!openLease.isCollapsed)
		{
			vm.openLeasesCountRequestDto.regionId = openLease.regionID
			vm.openLeasesCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Districts

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLeasesCountReport(vm.openLeasesCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLease.regionID
							vm.openLeasesCountReportResultDto.splice((vm.openLeasesCountReportResultDto.indexOf(openLease) + index + 1), 0, item)
						})
					}

					if (vm.isExpandabe)
					{
						if ((vm.openLeasesCountRequestDto.districtDealerIds != 'undefined') &&
                            (vm.openLeasesCountRequestDto.districtDealerIds.length > 0))
						{
							vm.openLeasesCountReportResultDto[1].isCollapsed = false
							vm.getOpenLeasesCountByDistrict(vm.openLeasesCountReportResultDto[1])
							vm.isExpandabe = false
						}
					}
				})
				.catch(function(result)
				{
					$loading.finish('viewHost')
					toastr.error($translate.instant('RPT_ERR_RETRIEVING_REPORT') + ' ' + result.data.errorMessage)
				})
		}
		else
		{            
			for (var i = vm.openLeasesCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if (vm.openLeasesCountReportResultDto[i].parentRegionID == openLease.regionID)
				{
					vm.openLeasesCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLeasesCountRequestDto()
	}

	vm.getOpenLeasesCountByDistrict = function(openLease)
	{        
		if (!openLease.isCollapsed)
		{
			vm.openLeasesCountRequestDto.regionId = openLease.parentRegionID
			vm.openLeasesCountRequestDto.districtId = openLease.districtID
			vm.openLeasesCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Dealers

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLeasesCountReport(vm.openLeasesCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLease.parentRegionID
							item.parentDistrictID = openLease.districtID
							vm.openLeasesCountReportResultDto.splice((vm.openLeasesCountReportResultDto.indexOf(openLease) + index + 1), 0, item)
						})
					}
				})
				.catch(function(result)
				{
					$loading.finish('viewHost')
					toastr.error($translate.instant('RPT_ERR_RETRIEVING_REPORT') + ' ' + result.data.errorMessage)
				})
		}
		else
		{
			for (var i = vm.openLeasesCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if ((vm.openLeasesCountReportResultDto[i].parentRegionID == openLease.parentRegionID) &&
                    (vm.openLeasesCountReportResultDto[i].parentDistrictID == openLease.districtID))
				{
					vm.openLeasesCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLeasesCountRequestDto()
	}

	vm.getOpenLeasesCountByDealer = function(openLease)
	{        
		if (!openLease.isCollapsed)
		{
			vm.openLeasesCountRequestDto.regionId = openLease.parentRegionID
			vm.openLeasesCountRequestDto.districtId = openLease.parentDistrictID
			vm.openLeasesCountRequestDto.dealerId = openLease.dealerID
			vm.openLeasesCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Models

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLeasesCountReport(vm.openLeasesCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLease.regionID
							vm.openLeasesCountReportResultDto.splice((vm.openLeasesCountReportResultDto.indexOf(openLease) + index + 1), 0, item)
						})
					}

					if (vm.isExpandabe)
					{
						if ((vm.openLeasesCountRequestDto.districtDealerIds != 'undefined') &&
							(vm.openLeasesCountRequestDto.districtDealerIds.length > 0))
						{
							vm.openLeasesCountReportResultDto[1].isCollapsed = false
							vm.getOpenLeasesCountByDistrict(vm.openLeasesCountReportResultDto[1])
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
			for (var i = vm.openLeasesCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if (vm.openLeasesCountReportResultDto[i].parentRegionID == openLease.parentRegionID && 
                    vm.openLeasesCountReportResultDto[i].parentDistrictID == openLease.parentDistrictID && 
                    vm.openLeasesCountReportResultDto[i].parentDealerID == openLease.dealerID)
				{
					vm.openLeasesCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLeasesCountRequestDto()
	}

	vm.getOpenLeasesCountByModel = function(openLease)
	{        
		if (!openLease.isCollapsed)
		{            
			vm.openLeasesCountRequestDto.regionId = openLease.parentRegionID
			vm.openLeasesCountRequestDto.districtId = openLease.parentDistrictID
			vm.openLeasesCountRequestDto.dealerId = openLease.parentDealerID
			vm.openLeasesCountRequestDto.model = openLease.model
			vm.openLeasesCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.ModelYears

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLeasesCountReport(vm.openLeasesCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLease.parentRegionID
							item.parentDistrictID = openLease.districtID
							vm.openLeasesCountReportResultDto.splice((vm.openLeasesCountReportResultDto.indexOf(openLease) + index + 1), 0, item)
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
			for (var i = vm.openLeasesCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if ((vm.openLeasesCountReportResultDto[i].parentRegionID == openLease.parentRegionID) &&
					(vm.openLeasesCountReportResultDto[i].parentDistrictID == openLease.districtID))
				{
					vm.openLeasesCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLeasesCountRequestDto()
	}

	vm.getOpenLeasesCountByDealer = function(openLease)
	{        
		if (!openLease.isCollapsed)
		{
			vm.openLeasesCountRequestDto.regionId = openLease.parentRegionID
			vm.openLeasesCountRequestDto.districtId = openLease.parentDistrictID
			vm.openLeasesCountRequestDto.dealerId = openLease.dealerID

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLeasesCountReport(vm.openLeasesCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLease.parentRegionID
							item.parentDistrictID = openLease.parentDistrictID
							item.parentDealerID = openLease.dealerID
							vm.openLeasesCountReportResultDto.splice((vm.openLeasesCountReportResultDto.indexOf(openLease) + index + 1), 0, item)
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
			for (var i = vm.openLeasesCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if (vm.openLeasesCountReportResultDto[i].parentRegionID == openLease.parentRegionID && 
					vm.openLeasesCountReportResultDto[i].parentDistrictID == openLease.parentDistrictID &&
					vm.openLeasesCountReportResultDto[i].parentDealerID == openLease.dealerID)
				{
					vm.openLeasesCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLeasesCountRequestDto()
	}

	vm.getOpenLeasesCountByModel = function(openLease)
	{        
		if (!openLease.isCollapsed)
		{            
			vm.openLeasesCountRequestDto.regionId = openLease.parentRegionID
			vm.openLeasesCountRequestDto.districtId = openLease.parentDistrictID
			vm.openLeasesCountRequestDto.dealerId = openLease.parentDealerID
			vm.openLeasesCountRequestDto.model = openLease.model

			$loading.start('viewHost')
			ReportingService
				.retrieveOpenLeasesCountReport(vm.openLeasesCountRequestDto)
				.then(function(result)
				{
					$loading.finish('viewHost')
					if (result.data.actionResult.length > 0)
					{
						result.data.actionResult.forEach(function(item, index)
						{
							item.isCollapsed = true

							item.parentRegionID = openLease.parentRegionID
							item.parentDistrictID = openLease.parentDistrictID
							item.parentDealerID = openLease.parentDealerID
							item.parentModel = openLease.model
							vm.openLeasesCountReportResultDto.splice((vm.openLeasesCountReportResultDto.indexOf(openLease) + index + 1), 0, item)
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
			for (var i = vm.openLeasesCountReportResultDto.length - 1; i >= 0; i -= 1)
			{
				if (vm.openLeasesCountReportResultDto[i].parentRegionID == openLease.parentRegionID && 
					vm.openLeasesCountReportResultDto[i].parentDistrictID == openLease.parentDistrictID &&
					vm.openLeasesCountReportResultDto[i].parentDealerID == openLease.parentDealerID &&
					vm.openLeasesCountReportResultDto[i].parentModel == openLease.model)
				{
					vm.openLeasesCountReportResultDto.splice(i, 1)
				}
			}
		}
		vm.resetOpenLeasesCountRequestDto()
	}

	vm.getOpenLeasesCountReport = function()
	{
		$timeout(function()
		{
			$loading.start('viewHost')
		}, 100)

		ReportingService
			.retrieveOpenLeasesCountReport(vm.openLeasesCountRequestDto)
			.then(function(result)
			{
				$loading.finish('viewHost')
				vm.openLeasesCountReportResultDto = result.data.actionResult
				vm.noResultsVisibility = (vm.openLeasesCountReportResultDto.length == 0) ? 'visible' : 'hidden'
				vm.gridVisibility = (vm.openLeasesCountReportResultDto.length > 0) ? 'visible' : 'hidden'
				if (vm.openLeasesCountReportResultDto.length > 0)
				{
					vm.openLeasesCountReportResultDto.forEach(function(item)
					{
						item.isCollapsed = true
					})

					if (vm.isExpandabe)
					{
						if ((vm.openLeasesCountRequestDto.regionDistrictIds != 'undefined') &&
							(vm.openLeasesCountRequestDto.regionDistrictIds.length > 0))
						{
							vm.openLeasesCountReportResultDto[0].isCollapsed = false
							vm.getOpenLeasesCountByRegion(vm.openLeasesCountReportResultDto[0])

							if (vm.openLeasesCountRequestDto.districtDealerIds.length == 0)
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

		vm.resetOpenLeasesCountRequestDto()
	}

	vm.resetOpenLeasesCountRequestDto = function()
	{
		vm.openLeasesCountRequestDto.regionId = null
		vm.openLeasesCountRequestDto.districtId = null
		vm.openLeasesCountRequestDto.dealerId = null
		vm.openLeasesCountRequestDto.model = null      
	}

	vm.downloadResults = function()
	{
		if (vm.openLeasesCountReportResultDto != undefined)
		{
			SiteService.dataExportResponse = vm.convertToCSV(JSON.stringify(vm.openLeasesCountReportResultDto))
			vm.downloadDialog()
		}
	}

	vm.convertToCSV = function(JSONData) 
	{
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData
		var csvdata = []
		var topHeading = ',,,,,Lease End of Term in x Months,'        
		var mainHeading = 'Region,District,Dealer,Model,Year,1,2,3,4,5,6,12,18,24,36,48,60,Total Leases'
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
				(arrData[i]['totalLeases'] == null ? '' : '="' + arrData[i]['totalLeases'] + '"')

			csvdata.push(row)
		}

		var dataExportResponseDto = 
		{
			fileData: csvdata,
			fileName: 'OpenLeaseCountReport.csv',
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
			vm.openLeasesCountReportResultDto = SiteService.viewParameters.countReport
			SiteService.viewParameters.countReport = null
			vm.resetOpenLeasesCountRequestDto()
			vm.isExpandabe = false
		}
		else
		{			
			vm.getOpenLeasesCountReport()			
		}
	}

	vm.attachRegionsDistrictsDealers = function()
	{
		vm.openLeasesCountRequestDto.oemId = SiteService.loginSession.user.oemId
		
		if ((SiteService.userGroupId() == Enums.userGroups.OEMs) &&
			(SiteService.isInRoles([Enums.userRoles.RegionalManager])))
		{
			vm.openLeasesCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Region
		}

		SiteService.loginSession.user.oemUserRegions.forEach(function(region)
		{
			vm.openLeasesCountRequestDto.regionIds.push(region.businessRegionId)
			vm.totalLeasesRegionIds.push(region.businessRegionId)			

			if ((SiteService.userGroupId() == Enums.userGroups.Dealers) ||
				(SiteService.isInRoles([Enums.userRoles.DistrictManager])))
			{
				if (region.oemUserDistricts)
				{
					vm.openLeasesCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.District

					region.oemUserDistricts.forEach(function(district)
					{                        
						if (district.businessRegionId == region.businessRegionId)
						{
							vm.openLeasesCountRequestDto.regionDistrictIds.push(district.businessDistrictId)

							if (district.dealers)
							{
								vm.openLeasesCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Dealer

								district.dealers.forEach(function(dealer)
								{
									if (dealer.businessDistrictId == district.businessDistrictId)
									{
										vm.openLeasesCountRequestDto.districtDealerIds.push(dealer.dealerId)
									}
								})
							}
						}
					})
				}
			}
		})
		
		if ((SiteService.userGroupId() == Enums.userGroups.OEMs) &&
			(SiteService.isInRoles([Enums.userRoles.NationalManager, Enums.userRoles.OEMAdministrator])))
		{
			vm.openLeasesCountRequestDto.reportFocusTypeId = Enums.reportFocusTypes.Nation

			if (SiteService.viewParameters.businessRegions && 
				SiteService.viewParameters.businessRegions.length > 0)
			{
				vm.openLeasesCountRequestDto.regionIds = []
				vm.totalLeasesRegionIds = []
				vm.openLeasesCountRequestDto.isNational = true

				SiteService.viewParameters.businessRegions
					.forEach(function(businessRegion)
					{
						vm.openLeasesCountRequestDto.regionIds.push(businessRegion.businessRegionId)
						vm.totalLeasesRegionIds.push(businessRegion.businessRegionId)
					})
			}
		}
		
	}

	vm.getPortfoliosByMonth = function(eotMonth)
	{
		vm.portfolioSearchRequest.isAccountActive = true
		vm.portfolioSearchRequest.isValidModel = true
		vm.portfolioSearchRequest.financeContractTypeId = Enums.financeContractTypes.Lease
		vm.portfolioSearchRequest.oemIds.push(vm.openLeasesCountRequestDto.oemId)

		if (eotMonth.openLease.regionName)
		{
			if (eotMonth.openLease.regionName != 'Total' && 
				eotMonth.openLease.regionName != 'Terminated Dealers' && 
				eotMonth.openLease.regionID)
			{
				vm.portfolioSearchRequest.regionIds.push(eotMonth.openLease.regionID)

				if (vm.openLeasesCountRequestDto.regionDistrictIds && 
					vm.openLeasesCountRequestDto.regionDistrictIds.length > 0)
				{
					vm.portfolioSearchRequest.districtIds = vm.openLeasesCountRequestDto.regionDistrictIds
				}
				if (vm.openLeasesCountRequestDto.districtDealerIds && 
					vm.openLeasesCountRequestDto.districtDealerIds.length > 0)
				{
					vm.portfolioSearchRequest.dealerIds = vm.openLeasesCountRequestDto.districtDealerIds
				}
			}
			else if (eotMonth.openLease.regionName == 'Total')
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
					vm.portfolioSearchRequest.regionIds = vm.totalLeasesRegionIds
					
					if (vm.openLeasesCountRequestDto.regionDistrictIds &&
						vm.openLeasesCountRequestDto.regionDistrictIds.length > 0)
					{
						vm.portfolioSearchRequest.districtIds = vm.openLeasesCountRequestDto.regionDistrictIds
					}
					if (vm.openLeasesCountRequestDto.districtDealerIds &&
						vm.openLeasesCountRequestDto.districtDealerIds.length > 0)
					{
						vm.portfolioSearchRequest.dealerIds = vm.openLeasesCountRequestDto.districtDealerIds
					}  
				}                             
			}
			else if (eotMonth.openLease.regionName == 'Terminated Dealers')
			{                
				vm.portfolioSearchRequest.regionIds = []
				vm.portfolioSearchRequest.districtIds = []
				vm.portfolioSearchRequest.dealerIds = []
				vm.portfolioSearchRequest.isTerminatedDealer = true
			}
		}
		else if (eotMonth.openLease.districtID)
		{
			vm.portfolioSearchRequest.districtIds.push(eotMonth.openLease.districtID)
			vm.portfolioSearchRequest.regionIds.push(eotMonth.openLease.parentRegionID)

			if (vm.openLeasesCountRequestDto.districtDealerIds && 
				vm.openLeasesCountRequestDto.districtDealerIds.length > 0)
			{
				vm.portfolioSearchRequest.dealerIds = vm.openLeasesCountRequestDto.districtDealerIds
			}
		}
		else if (eotMonth.openLease.dealerID)
		{
			vm.portfolioSearchRequest.dealerIds.push(eotMonth.openLease.dealerID)
			vm.portfolioSearchRequest.districtIds.push(eotMonth.openLease.parentDistrictID)
			vm.portfolioSearchRequest.regionIds.push(eotMonth.openLease.parentRegionID)
		}
		else if (eotMonth.openLease.model)
		{
			vm.portfolioSearchRequest.vehicleModel = eotMonth.openLease.model
			vm.portfolioSearchRequest.dealerIds.push(eotMonth.openLease.parentDealerID)
			vm.portfolioSearchRequest.districtIds.push(eotMonth.openLease.parentDistrictID)
			vm.portfolioSearchRequest.regionIds.push(eotMonth.openLease.parentRegionID)
		}
		else if (eotMonth.openLease.year)
		{
			vm.portfolioSearchRequest.vehicleYear = eotMonth.openLease.year
			vm.portfolioSearchRequest.vehicleModel = eotMonth.openLease.parentModel
			vm.portfolioSearchRequest.dealerIds.push(eotMonth.openLease.parentDealerID)
			vm.portfolioSearchRequest.districtIds.push(eotMonth.openLease.parentDistrictID)
			vm.portfolioSearchRequest.regionIds.push(eotMonth.openLease.parentRegionID)
		}

		vm.calculatePortfolioMaturityDate(eotMonth)

		SiteService.viewParameters.portfolioList = {}
		SiteService.viewParameters.countReport = {}
		SiteService.viewParameters.portfolioList.backPageURL = 'open-contract-count/openLeaseCountReporting'

		SiteService.viewParameters.countReport = vm.openLeasesCountReportResultDto
		SiteService.viewParameters.portfolioList.titleType = Enums.searchResultTitleTypes.OpenLeaseCountReport
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
		else if (eotMonth.totalLeases)
		{
			mStart.setMonth(mStart.getMonth() + 0)
			mStop.setMonth(mStop.getMonth() + 60)
		}

		vm.portfolioSearchRequest.maturityDateStart = mStart
		vm.portfolioSearchRequest.maturityDateStop = mStop
	}

	$scope.$on('refreshPageCollection', function()
	{
		vm.refreshPageCollection()
	})

	$scope.$on('downloadResults', function()
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
				$scope.$emit('onContractReportChanged', { reportTypeId: 1 })
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