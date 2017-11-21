'use strict'

require('angular')
	.module('driveThru.reporting')
	.controller('OpenContractCountController', require('./controller'))

require('./open-lease-count')
require('./open-loan-count')