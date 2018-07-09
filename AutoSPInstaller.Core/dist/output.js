/// <reference path="../../typings/tsd.d.ts" />
"use strict";
/// <reference path="../typings/tsd.d.ts" />
(function () {
    "use strict";
    angular
        .module("ASPIO", ["ngRoute", "ngMessages", "ui.bootstrap"]);
})();
/// <reference path="../typings/tsd.d.ts" />
(function () {
    "use strict";
    angular
        .module("ASPIO")
        .config(["$tooltipProvider", function ($tooltipProvider) {
            $tooltipProvider.options({ appendToBody: true, popupDelay: 500 });
        }
    ])
        .config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
            $routeProvider
                .when("/", {
                title: "Home - AutoSPInstaller Online",
                description: "New AutoSPInstaller Configuration Interface. Assists with PowerShell based deployments of SharePoint 2010 and 2013.",
                templateUrl: "Partials/_homePartial.html",
                controller: "Blank"
            })
                .when("/FarmConfiguration", {
                title: "Farm Configuration - AutoSPInstaller Online",
                description: "Farm Configuration interface, replacement for AutoSPInstallerGUI",
                templateUrl: "Partials/_ASPIOPartial.html",
                controller: "FarmConfiguration"
            })
                .when("/Guide", {
                description: "Guide on how to use AutoSPInstaller",
                title: "Guide - AutoSPInstaller Online",
                templateUrl: "Partials/_guidePartial.html",
                controller: "Blank"
            })
                .when("/Download", {
                description: "Download the latest version of AutoSPInstaller",
                title: "Download - AutoSPInstaller Online",
                templateUrl: "Partials/_downloadPartial.html",
                controller: "Blank"
            })
                .when("/Privacy", {
                description: "Terms of Service and Privacy Policy",
                title: "ToS & Privacy - AutoSPInstaller Online",
                templateUrl: "Partials/_privacyPartial.html",
                controller: "Blank"
            })
                .when("/Contact", {
                description: "Contact Information",
                title: "Contact - AutoSPInstaller Online",
                templateUrl: "Partials/_contactPartial.html",
                controller: "Blank"
            })
                .when("/News", {
                description: "AutoSPIntaller related news",
                title: "News - AutoSPInstaller Online",
                templateUrl: "Partials/_newsPartial.html",
                controller: "Blank"
            })
                .when("/FAQ", {
                description: "Frequently Asked Questions",
                title: "FAQ - AutoSPInstaller Online",
                templateUrl: "Partials/_faqPartial.html",
                controller: "Blank"
            })
                .otherwise({
                redirectTo: "/"
            });
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            $locationProvider.hashPrefix("!");
        }])
        .run(["$location", "$rootScope", function ($location, $rootScope) {
            $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
                if (current.hasOwnProperty("$$route")) {
                    $rootScope.title = current.$$route.title;
                    $rootScope.description = current.$$route.description;
                }
            });
        }
    ]);
})();
/// <reference path="../../typings/tsd.d.ts" />
(function () {
    "use strict";
    function BlankController($scope, xmlService) {
        var vm = this;
        function activate() {
            window.onbeforeunload = function (event) {
                // Only warn user if there is a existing Configuration
                if (xmlService.config !== null) {
                    return "Are you sure you want to leave? Any unsaved Farm Configuration will be lost!";
                }
            };
            $scope.$on("$destroy", function () {
                window.onbeforeunload = undefined;
            });
        }
        activate();
    }
    BlankController.$inject = ["$scope", "xmlService"];
    angular
        .module("ASPIO")
        .controller("Blank", BlankController);
})();
/// <reference path="../../typings/tsd.d.ts" />
(function () {
    "use strict";
    angular
        .module("ASPIO")
        .controller("FarmConfiguration", ["$scope", "xmlService", function ($scope, xmlService) {
            window.onbeforeunload = function (event) {
                // Only warn user if there is a existing Configuration
                if (xmlService.config !== null) {
                    return "Are you sure you want to leave? Any unsaved Farm Configuration will be lost!";
                }
            };
            $scope.$on("$destroy", function () {
                window.onbeforeunload = undefined;
            });
            $scope.config = xmlService.config;
            $scope.loadXML = function (xml) {
                try {
                    // Try to Upgrade XML to Current Version
                    if (xml.indexOf("Version='3.99.60'") !== -1 || xml.indexOf("Version=\"3.99.60\"") !== -1) {
                        xmlService.LoadXml(xml);
                    }
                    else if (xml.indexOf("Version='3.99.51'") !== -1 || xml.indexOf("Version=\"3.99.51\"") !== -1) {
                        xmlService.UpgrdeXml39951to39960(xml);
                        alert("Your XML Schema was upgraded from 3.99.51 to 3.99.60. Please download the latest version of AutoSPInstaller in order to use this configuration.");
                    }
                    else if (xml.indexOf("Version='3.99.5'") !== -1 || xml.indexOf("Version=\"3.99.5\"") !== -1) {
                        xmlService.UpgrdeXml3995toLatest(xml);
                        alert("Your XML Schema was upgraded from 3.99.5 to 3.99.60. Please download the latest version of AutoSPInstaller in order to use this configuration.");
                    }
                    else if (xml.indexOf("Version='3.99'") !== -1 || xml.indexOf("Version=\"3.99\"") !== -1) {
                        xmlService.UpgrdeXml399toLatest(xml);
                        alert("Your XML Schema was upgraded from 3.99 to 3.99.60. Please download the latest version of AutoSPInstaller in order to use this configuration.");
                    }
                    else if (xml.indexOf("Version='3.98'") !== -1 || xml.indexOf("Version=\"3.98\"") !== -1) {
                        xmlService.UpgrdeXml398toLatest(xml);
                        alert("Your XML Schema was upgraded from 3.98 to 3.99.60. Please download the latest version of AutoSPInstaller in order to use this configuration.");
                    }
                    else {
                        alert("This XML Version is not supported. We only support the XML version 3.98 and later. Please download the latest version of AutoSPInstaller or manually update the XML to reflect the new changes.");
                        return;
                    }
                    $scope.config = xmlService.config;
                    // Initialize Managed Account Array
                    if (!$scope.config.value.farm.managedAccounts.managedAccount) {
                        $scope.config.value.farm.managedAccounts.managedAccount = [];
                    }
                    // Initialize Web App Array
                    if (!$scope.config.value.webApplications.webApplication) {
                        $scope.config.value.webApplications.webApplication = [];
                    }
                    // Fix WebApp Managed Paths and Site Collection Arrays
                    for (var i = 0, len = $scope.config.value.webApplications.webApplication.length; i < len; i++) {
                        if (!$scope.config.value.webApplications.webApplication[i].managedPaths.managedPath) {
                            $scope.config.value.webApplications.webApplication[i].managedPaths.managedPath = [];
                        }
                        if (!$scope.config.value.webApplications.webApplication[i].siteCollections.siteCollection) {
                            $scope.config.value.webApplications.webApplication[i].siteCollections.siteCollection = [];
                        }
                    }
                }
                catch (err) {
                    alert("There is an issue with the XML. Please check that its a valid XML and that it is at least version 3.98. Error: " + err.message);
                    return;
                }
                $scope.setView("Servers");
            };
            $scope.loadTemplate = function () {
                $scope.loadXML("<Configuration Environment='Dev' Version='3.99.60'><Install SPVersion='2019'><ConfigFile>config-AutoSPInstaller.xml</ConfigFile><InstallDir></InstallDir><DataDir></DataDir><PIDKey></PIDKey><SKU>Enterprise</SKU><OfflineInstall>false</OfflineInstall><PauseAfterInstall>false</PauseAfterInstall><RemoteInstall Enable='false'><ParallelInstall>false</ParallelInstall></RemoteInstall><AutoAdminLogon Enable='false'><Password></Password></AutoAdminLogon><Disable><LoopbackCheck>true</LoopbackCheck><UnusedServices>true</UnusedServices><IEEnhancedSecurity>true</IEEnhancedSecurity><CertificateRevocationListCheck>false</CertificateRevocationListCheck></Disable></Install><Farm><Passphrase></Passphrase><Account><AddToLocalAdminsDuringSetup>true</AddToLocalAdminsDuringSetup><LeaveInLocalAdmins>false</LeaveInLocalAdmins><Username>CONTOSO\\SP_Farm</Username><Password></Password></Account><CentralAdmin Provision='localhost'><Database>Content_CentralAdmin</Database><Port>2019</Port><UseSSL>true</UseSSL></CentralAdmin><Database><DBServer></DBServer><DBAlias Create='true'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias><DBPrefix>AutoSPInstaller</DBPrefix><ConfigDB>Config</ConfigDB></Database><Services><SandboxedCodeService Start='false'/><ClaimsToWindowsTokenService Start='false' UpdateAccount='false'/><SMTP Install='false'/><OutgoingEmail Configure='false'><SMTPServer></SMTPServer><EmailAddress></EmailAddress><ReplyToEmail></ReplyToEmail></OutgoingEmail><IncomingEmail Start='localhost'/><DistributedCache Start='localhost'/><WorkflowTimer Start='localhost'/><FoundationWebApplication Start='localhost'/></Services><ServerRoles><Custom Provision='localhost'/><WebFrontEnd Provision='false'/><WebFrontEndWithDistributedCache Provision='false'/><SingleServerFarm Provision='false'/><Search Provision='false'/><Application Provision='false'/><ApplicationWithSearch Provision='false'/><DistributedCache Provision='false'/></ServerRoles><ManagedAccounts><ManagedAccount CommonName='spservice'><Username>CONTOSO\\SP_Services</Username><Password></Password></ManagedAccount><ManagedAccount CommonName='Portal'><Username>CONTOSO\\SP_PortalAppPool</Username><Password></Password></ManagedAccount><ManagedAccount CommonName='MySiteHost'><Username>CONTOSO\\SP_ProfilesAppPool</Username><Password></Password></ManagedAccount><ManagedAccount CommonName='SearchService'><Username>CONTOSO\\SP_SearchService</Username><Password></Password></ManagedAccount></ManagedAccounts><ObjectCacheAccounts><SuperUser>CONTOSO\\SP_CacheSuperUser</SuperUser><SuperReader>CONTOSO\\SP_CacheSuperReader</SuperReader></ObjectCacheAccounts><Logging><IISLogs Compress='true'><Path></Path></IISLogs><ULSLogs Compress='true'><LogLocation></LogLocation><LogDiskSpaceUsageGB></LogDiskSpaceUsageGB><DaysToKeepLogs></DaysToKeepLogs><LogCutInterval></LogCutInterval></ULSLogs><UsageLogs Compress='true'><UsageLogDir></UsageLogDir><UsageLogMaxSpaceGB></UsageLogMaxSpaceGB><UsageLogCutTime></UsageLogCutTime></UsageLogs></Logging></Farm><WebApplications AddURLsToHOSTS='true'><WebApplication Name='Portal Home'><Type>Portal</Type><ApplicationPool>portal.contoso.com</ApplicationPool><Url>http://portal.contoso.com</Url><Port>80</Port><UseHostHeader>false</UseHostHeader><AddURLToLocalIntranetZone>true</AddURLToLocalIntranetZone><GrantCurrentUserFullControl>true</GrantCurrentUserFullControl><UseClaims>true</UseClaims><UseBasicAuthentication>false</UseBasicAuthentication><UseOnlineWebPartCatalog>false</UseOnlineWebPartCatalog><Database><Name>Content_Portal</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database><ManagedPaths><ManagedPath relativeUrl='help' explicit='true'/></ManagedPaths><SiteCollections><SiteCollection siteUrl='http://portal.contoso.com'><Name>Portal Home</Name><Description>Portal Home Site</Description><HostNamedSiteCollection>false</HostNamedSiteCollection><Owner></Owner><CustomDatabase></CustomDatabase><SearchUrl>http://portal.contoso.com/search</SearchUrl><Template>SITEPAGEPUBLISHING#0</Template><LCID>1033</LCID><Locale>en-us</Locale><Time24>false</Time24></SiteCollection></SiteCollections></WebApplication><WebApplication Name='MySite Host'><Type>MySiteHost</Type><ApplicationPool>mysites.contoso.com</ApplicationPool><Url>http://mysites.contoso.com</Url><Port>80</Port><UseHostHeader>true</UseHostHeader><AddURLToLocalIntranetZone>true</AddURLToLocalIntranetZone><GrantCurrentUserFullControl>true</GrantCurrentUserFullControl><UseClaims>true</UseClaims><UseBasicAuthentication>false</UseBasicAuthentication><UseOnlineWebPartCatalog>false</UseOnlineWebPartCatalog><Database><Name>Content_MySites</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database><ManagedPaths><ManagedPath relativeUrl='personal' explicit='false'/></ManagedPaths><SiteCollections><SiteCollection siteUrl='http://mysites.contoso.com'><Name>My Site Host</Name><Description>My Site Host</Description><HostNamedSiteCollection>false</HostNamedSiteCollection><Owner></Owner><CustomDatabase></CustomDatabase><SearchUrl>http://portal.contoso.com/search</SearchUrl><Template>SPSMSITEHOST#0</Template><LCID>1033</LCID><Locale>en-us</Locale><Time24>false</Time24></SiteCollection></SiteCollections></WebApplication></WebApplications><ServiceApps><ManagedMetadataServiceApp Provision='localhost'><Name>Managed Metadata Service</Name><ProxyName>Managed Metadata Service</ProxyName><Database><Name>Metadata</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></ManagedMetadataServiceApp><UserProfileServiceApp Provision='localhost'><Name>User Profile Service Application</Name><ProxyName>User Profile Service Application</ProxyName><MySiteHostLocation></MySiteHostLocation><MySiteManagedPath>personal</MySiteManagedPath><EnableNetBIOSDomainNames>false</EnableNetBIOSDomainNames><StartProfileSync>true</StartProfileSync><CreateDefaultSyncConnection>false</CreateDefaultSyncConnection><SyncConnectionAccount>CONTOSO\\SP_ProfileSync</SyncConnectionAccount><SyncConnectionAccountPassword></SyncConnectionAccountPassword><Database><ProfileDB>Profile</ProfileDB><SyncDB>Profile_Sync</SyncDB><SocialDB>Profile_Social</SocialDB><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></UserProfileServiceApp><EnterpriseSearchService Provision='localhost'><ContactEmail></ContactEmail><ConnectionTimeout>60</ConnectionTimeout><AcknowledgementTimeout>60</AcknowledgementTimeout><ProxyType>Default</ProxyType><IgnoreSSLWarnings>true</IgnoreSSLWarnings><InternetIdentity>Mozilla/4.0 (compatible; MSIE 4.01; Windows NT; MS Search 6.0 Robot)</InternetIdentity><CustomIndexLocation></CustomIndexLocation><PerformanceLevel>PartlyReduced</PerformanceLevel><ShareName>SearchIndex</ShareName><EnterpriseSearchServiceApplications><EnterpriseSearchServiceApplication Name='Search Service Application'><FailoverDatabaseServer></FailoverDatabaseServer><Partitioned>false</Partitioned><Partitions>1</Partitions><SearchServiceApplicationType>Regular</SearchServiceApplicationType><ContentAccessAccount>CONTOSO\\SP_SearchContent</ContentAccessAccount><ContentAccessAccountPassword></ContentAccessAccountPassword><Database><Name>Search</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database><ApplicationPool Name='SharePoint Search Application Pool'/><CrawlComponent Provision='localhost'/><QueryComponent Provision='localhost'/><SearchQueryAndSiteSettingsComponent Provision='localhost'/><AdminComponent Provision='localhost'><ApplicationPool Name='SharePoint Search Application Pool'/></AdminComponent><IndexComponent Provision='localhost'/><ContentProcessingComponent Provision='localhost'/><AnalyticsProcessingComponent Provision='localhost'/><Proxy Name='Search Service Application'><Partitioned>false</Partitioned><ProxyGroup>Default</ProxyGroup></Proxy><SearchCenterUrl></SearchCenterUrl></EnterpriseSearchServiceApplication></EnterpriseSearchServiceApplications></EnterpriseSearchService><StateService Provision='localhost'><Name>State Service</Name><ProxyName>State Service</ProxyName><Database><Name>StateService</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></StateService><WebAnalyticsService Provision='localhost'><Name>Web Analytics Service Application</Name><Database><ReportingDB>WebAnalyticsReporting</ReportingDB><StagingDB>WebAnalyticsStaging</StagingDB><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></WebAnalyticsService><SPUsageService Provision='localhost'><Name>Usage and Health Data Collection</Name><Database><Name>UsageAndHealth</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></SPUsageService><SecureStoreService Provision='localhost'><Name>Secure Store Service</Name><ProxyName>Secure Store Service</ProxyName><Database><Name>SecureStore</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></SecureStoreService><BusinessDataConnectivity Provision='false'><Name>Business Data Connectivity Service</Name><ProxyName>Business Data Connectivity Service</ProxyName><Database><Name>BusinessDataCatalog</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></BusinessDataConnectivity><WordAutomationService Provision='false'><Name>Word Automation Services</Name><ProxyName>Word Automation Services</ProxyName><Database><Name>WordAutomation</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></WordAutomationService><AppManagementService Provision='localhost'><Name>App Management Service</Name><ProxyName>App Management Service</ProxyName><AppDomain>apps.contoso.com</AppDomain><Database><Name>AppManagement</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></AppManagementService><SubscriptionSettingsService Provision='localhost'><Name>Subscription Settings Service</Name><AppSiteSubscriptionName>app</AppSiteSubscriptionName><Database><Name>SubscriptionSettings</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></SubscriptionSettingsService><WorkManagementService Provision='localhost'><Name>Work Management Service Application</Name><ProxyName>Work Management Service Application</ProxyName></WorkManagementService><MachineTranslationService Provision='localhost'><Name>Machine Translation Service</Name><ProxyName>Machine Translation Service</ProxyName><Database><Name>TranslationService</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></MachineTranslationService><PowerPointConversionService Provision='localhost'><Name>PowerPoint Conversion Service Application</Name><ProxyName>PowerPoint Conversion Service Application</ProxyName></PowerPointConversionService></ServiceApps><EnterpriseServiceApps><ExcelServices Provision='false'><Name>Excel Services Application</Name><UnattendedIDUser>CONTOSO\\SP_ExcelUser</UnattendedIDUser><UnattendedIDPassword></UnattendedIDPassword></ExcelServices><VisioService Provision='false'><Name>Visio Graphics Service</Name><ProxyName>Visio Graphics Service</ProxyName><UnattendedIDUser>CONTOSO\\SP_VisioUser</UnattendedIDUser><UnattendedIDPassword></UnattendedIDPassword></VisioService><AccessService Provision='false'><Name>Access 2010 Service</Name><ProxyName>Access 2010 Service</ProxyName></AccessService><AccessServices Provision='false'><Name>Access Services</Name><ProxyName>Access Services</ProxyName><Database><Name>AccessServices</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></AccessServices><PerformancePointService Provision='false'><Name>PerformancePoint Service</Name><ProxyName>PerformancePoint Service</ProxyName><UnattendedIDUser>CONTOSO\\SP_PerfPointUser</UnattendedIDUser><UnattendedIDPassword></UnattendedIDPassword><Database><Name>PerformancePoint</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></PerformancePointService></EnterpriseServiceApps><OfficeWebApps Install='false'><ConfigFile>config-OWA-2010.xml</ConfigFile><PIDKeyOWA></PIDKeyOWA><ExcelService Provision='false'><Name>Excel Web App</Name><ProxyName>Excel Web App</ProxyName><UnattendedIDUser>CONTOSO\\SP_ExcelUser</UnattendedIDUser><UnattendedIDPassword></UnattendedIDPassword></ExcelService><WordViewingService Provision='false'><Name>Word Viewing Service</Name><ProxyName>Word Viewing Service</ProxyName></WordViewingService><PowerPointService Provision='false'><Name>PowerPoint Service Application</Name><ProxyName>PowerPoint Service Application</ProxyName></PowerPointService></OfficeWebApps><ProjectServer Install='false'><ConfigFile>config-ProjectServer2013.xml</ConfigFile><PIDKeyProjectServer></PIDKeyProjectServer><ServiceApp Provision='localhost'><Name>Project Server Service Application</Name><ProxyName>Project Server Service Application</ProxyName><ManagedPath>PWA</ManagedPath><ServiceAccount>CONTOSO\\SP_ProjectServer</ServiceAccount><ServiceAccountPassword></ServiceAccountPassword><Database><Name>ProjectServer</Name><DBServer></DBServer><DBAlias Create='false'><DBInstance>SERVER\\INSTANCE</DBInstance><DBPort></DBPort></DBAlias></Database></ServiceApp></ProjectServer><AdobePDF><iFilter Install='false'/><Icon Configure='true'/><MIMEType Configure='true'/></AdobePDF><ForeFront Install='false'><ConfigFile>answerfile-ForeFront-2010.xml</ConfigFile></ForeFront></Configuration>");
            };
            $scope.view = "Servers";
            $scope.setView = function (view) {
                if (view === "Review") {
                    try {
                        $scope.output = xmlService.GetXml();
                    }
                    catch (err) {
                        alert("An error has occurred, please contact us below with steps on how to reproduce the issue. Error: " + err.message);
                        return;
                    }
                }
                $scope.view = view;
            };
            $scope.clearConfig = function () {
                if (confirm("Are you sure you want to clear the current configuration?")) {
                    $scope.config = null;
                    $scope.serversArray = [];
                }
            };
            // Server Section (move this to directive?)
            $scope.selectedServer = "";
            $scope.serversArray = [];
            $scope.addServer = function (server) {
                if (!server || server.toUpperCase() === "LOCALHOST") {
                    return;
                }
                server = server.toUpperCase().trim();
                if ($scope.serversArray.indexOf(server) === -1) {
                    $scope.serversArray.push(server);
                    $scope.newServer = "";
                }
            };
            $scope.removeServer = function () {
                if (this.serversArray.indexOf(this.selectedServer) > -1) {
                    this.serversArray.splice(this.serversArray.indexOf(this.selectedServer), 1);
                    if (this.serversArray.length > 0) {
                        this.selectedServer = this.serversArray[0];
                    }
                }
            };
            $scope.$watchCollection("serversArray", function () {
                if ($scope.serversArray.length > 0) {
                    $scope.selectedServer = $scope.serversArray[0];
                }
            });
            // Add/Remove Components
            $scope.addManagedAccount = function () {
                var managedAccount = new ManagedAccount();
                this.config.value.farm.managedAccounts.managedAccount.push(managedAccount);
            };
            $scope.removeManagedAccount = function (index) {
                this.config.value.farm.managedAccounts.managedAccount.splice(index, 1);
            };
            $scope.addWebApp = function () {
                var webApp = new WebApplication();
                webApp.name = "New" + this.config.value.webApplications.webApplication.length;
                this.config.value.webApplications.webApplication.push(webApp);
            };
            $scope.removeWebApp = function (index) {
                this.config.value.webApplications.webApplication.splice(index, 1);
            };
            $scope.addSiteCollection = function (siteCollections, webAppUrl) {
                var siteCollection = new SiteCollection();
                siteCollection.siteUrl = webAppUrl + "/sites/NewSite" + siteCollections.length;
                siteCollections.push(siteCollection);
            };
            $scope.removeSiteCollection = function (siteCollections, index) {
                siteCollections.splice(index, 1);
            };
            $scope.addManagedPath = function (managedPaths) {
                var managedPath = new ManagedPath();
                managedPaths.push(managedPath);
            };
            $scope.removeManagedPath = function (managedPaths, index) {
                managedPaths.splice(index, 1);
            };
            // Custom Validators
            $scope.validateminroles = function () {
                var serversArray = [];
                var valid = true;
                // validate that each server is only selected once.
                function validateSingleUse(provisionField) {
                    if (provisionField !== undefined && provisionField !== null && provisionField !== "" && provisionField.toLowerCase() !== "false") {
                        var tempArray = provisionField.replace(/ /g, ",").toUpperCase().split(",");
                        for (var i = 0, len = tempArray.length; i < len; i++) {
                            if (serversArray.indexOf(tempArray[i]) === -1) {
                                if (serversArray.length === 0 || (serversArray.length !== 0 && tempArray[i] !== "LOCALHOST" && serversArray.indexOf("LOCALHOST") === -1)) {
                                    serversArray.push(tempArray[i]);
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                valid = validateSingleUse(this.config.value.farm.serverRoles.webFrontEnd.provision);
                if (!valid) {
                    return false;
                }
                valid = validateSingleUse(this.config.value.farm.serverRoles.webFrontEndWithDistributedCache.provision);
                if (!valid) {
                    return false;
                }
                valid = validateSingleUse(this.config.value.farm.serverRoles.application.provision);
                if (!valid) {
                    return false;
                }
                valid = validateSingleUse(this.config.value.farm.serverRoles.applicationWithSearch.provision);
                if (!valid) {
                    return false;
                }
                valid = validateSingleUse(this.config.value.farm.serverRoles.distributedCache.provision);
                if (!valid) {
                    return false;
                }
                valid = validateSingleUse(this.config.value.farm.serverRoles.search.provision);
                if (!valid) {
                    return false;
                }
                valid = validateSingleUse(this.config.value.farm.serverRoles.custom.provision);
                if (!valid) {
                    return false;
                }
                valid = validateSingleUse(this.config.value.farm.serverRoles.singleServerFarm.provision);
                if (!valid) {
                    return false;
                }
                // Validate that each server is used once.
                if (serversArray.length === 0 || serversArray.indexOf("LOCALHOST") === -1 && serversArray.length !== $scope.serversArray.length) {
                    valid = false;
                }
                return valid;
            };
            $scope.validateManagedAccounts = function () {
                if (this.config.value.farm.managedAccounts.managedAccount.length === 0) {
                    return false;
                }
                if (this.config.value.serviceApps.enterpriseSearchService.provision !== "false") {
                    var isFoundSearch = false;
                    for (var i = 0, len = this.config.value.farm.managedAccounts.managedAccount.length; i < len; i++) {
                        if (this.config.value.farm.managedAccounts.managedAccount[i].commonName !== undefined && this.config.value.farm.managedAccounts.managedAccount[i].commonName.toLowerCase() === "searchservice") {
                            isFoundSearch = true;
                        }
                    }
                    if (isFoundSearch === false) {
                        return false;
                    }
                }
                var isFound = false;
                for (var i2 = 0, len2 = this.config.value.farm.managedAccounts.managedAccount.length; i2 < len2; i2++) {
                    if (this.config.value.farm.managedAccounts.managedAccount[i2].commonName !== undefined && this.config.value.farm.managedAccounts.managedAccount[i2].commonName.toLowerCase() === "spservice") {
                        isFound = true;
                    }
                }
                return isFound;
            };
            $scope.validateWebAppType = function (webAppType) {
                var isFound = false;
                for (var i = 0, len = this.config.value.farm.managedAccounts.managedAccount.length; i < len; i++) {
                    if (this.config.value.farm.managedAccounts.managedAccount[i].commonName === webAppType) {
                        isFound = true;
                    }
                }
                return isFound;
            };
            $scope.validateWebTemplate = function (template, webTemplates) {
                if (template === null) {
                    return true;
                }
                var isFound = false;
                if (webTemplates[template] !== undefined) {
                    isFound = true;
                }
                return isFound;
            };
            $scope.validatePassword = function (password) {
                if (password === undefined) {
                    return;
                }
                var anUpperCase = /[A-Z]/;
                var aLowerCase = /[a-z]/;
                var aNumber = /[0-9]/;
                var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
                if (password.length < 9) {
                    return false;
                }
                var numUpper = 0;
                var numLower = 0;
                var numNums = 0;
                var numSpecials = 0;
                for (var i = 0; i < password.length; i++) {
                    if (anUpperCase.test(password[i])) {
                        numUpper++;
                    }
                    else if (aLowerCase.test(password[i])) {
                        numLower++;
                    }
                    else if (aNumber.test(password[i])) {
                        numNums++;
                    }
                    else if (aSpecial.test(password[i])) {
                        numSpecials++;
                    }
                }
                var result = 0;
                if (numUpper >= 1) {
                    result++;
                }
                if (numLower >= 1) {
                    result++;
                }
                if (numNums >= 1) {
                    result++;
                }
                if (numSpecials >= 1) {
                    result++;
                }
                if (result >= 3) {
                    return true;
                }
                return false;
            };
            // Web Template Selections
            $scope.webTemplates2010 = {
                "OFFILE#0": "(obsolete) Records Center - OFFILE#0",
                "ACCSRV#0": "Access Services Site - ACCSRV#0",
                "ACCSRV#1": "Assets Web Database - ACCSRV#1",
                "MPS#0": "Basic Meeting Workspace - MPS#0",
                "SRCHCENTERLITE#0": "Basic Search Center - SRCHCENTERLITE#0",
                "SRCHCENTERLITE#1": "Basic Search Center - SRCHCENTERLITE#1",
                "MPS#1": "Blank Meeting Workspace - MPS#1",
                "STS#1": "Blank Site - STS#1",
                "BLOG#0": "Blog - BLOG#0",
                "BICenterSite#0": "Business Intelligence Center - BICenterSite#0",
                "CENTRALADMIN#0": "Central Admin Site - CENTRALADMIN#0",
                "ACCSRV#3": "Charitable Contributions Web Database - ACCSRV#3",
                "SPSPORTAL#0": "Collaboration Portal - SPSPORTAL#0",
                "SPSCOMMU#0": "Community area template - SPSCOMMU#0",
                "ACCSRV#4": "Contacts Web Database - ACCSRV#4",
                "SPSTOC#0": "Contents area Template - SPSTOC#0",
                "MPS#2": "Decision Meeting Workspace - MPS#2",
                "BDR#0": "Document Center - BDR#0",
                "STS#2": "Document Workspace - STS#2",
                "SRCHCEN#0": "Enterprise Search Center - SRCHCEN#0",
                "ENTERWIKI#0": "Enterprise Wiki - ENTERWIKI#0",
                "SRCHCENTERFAST#0": "FAST Search Center - SRCHCENTERFAST#0",
                "GLOBAL#0": "Global template - GLOBAL#0",
                "SGS#0": "Group Work Site - SGS#0",
                "ACCSRV#6": "Issues Web Database - ACCSRV#6",
                "AXSITEDEF#0": "Microsoft Dynamics Enterprise Portal - AXSITEDEF#0",
                "AXSITEDEF#1": "Microsoft Dynamics Public - AXSITEDEF#1",
                "PWS#0": "Microsoft Project Site - PWS#0",
                "MPS#4": "Multipage Meeting Workspace - MPS#4",
                "SPSMSITEHOST#0": "My Site Host - SPSMSITEHOST#0",
                "SPSNHOME#0": "News Site - SPSNHOME#0",
                "SPSNEWS#0": "News Site - SPSNEWS#0",
                "PPSMASite#0": "PerformancePoint - PPSMASite#0",
                "SPSMSITE#0": "Personalization Site - SPSMSITE#0",
                "BLANKINTERNET#1": "Press Releases Site - BLANKINTERNET#1",
                "PROFILES#0": "Profiles - PROFILES#0",
                "PWA#0": "Project Web App Site - PWA#0",
                "ACCSRV#5": "Projects Web Database - ACCSRV#5",
                "BLANKINTERNETCONTAINER#0": "Publishing Portal - BLANKINTERNETCONTAINER#0",
                "CMSPUBLISHING#0": "Publishing Site - CMSPUBLISHING#0",
                "BLANKINTERNET#0": "Publishing Site - BLANKINTERNET#0",
                "BLANKINTERNET#2": "Publishing Site with Workflow - BLANKINTERNET#2",
                "OFFILE#1": "Records Center - OFFILE#1",
                "SPSREPORTCENTER#0": "Report Center - SPSREPORTCENTER#0",
                "OSRV#0": "Shared Services Administration Site - OSRV#0",
                "SPSPERS#0": "SharePoint Portal Server Personal Space - SPSPERS#0",
                "SPS#0": "SharePoint Portal Server Site - SPS#0",
                "SPSSITES#0": "Site Directory - SPSSITES#0",
                "MPS#3": "Social Meeting Workspace - MPS#3",
                "STS#0": "Team Site - STS#0",
                "TENANTADMIN#0": "Tenant Admin Site - TENANTADMIN#0",
                "SPSTOPIC#0": "Topic area template - SPSTOPIC#0",
                "visprus#0": "Visio Process Repository - visprus#0",
                "WIKI#0": "Wiki Site - WIKI#0"
            };
            $scope.webTemplates2013 = {
                "OFFILE#0": "(obsolete) Records Center - OFFILE#0",
                "DOCMARKETPLACESITE#0": "Academic Library - DOCMARKETPLACESITE#0",
                "ACCSRV#0": "Access Services Site - ACCSRV#0",
                "ACCSVC#1": "Access Services Site - ACCSVC#1",
                "ACCSVC#0": "Access Services Site Internal - ACCSVC#0",
                "APPCATALOG#0": "App Catalog Site - APPCATALOG#0",
                "APP#0": "App Template - APP#0",
                "MPS#0": "Basic Meeting Workspace - MPS#0",
                "SRCHCENTERLITE#1": "Basic Search Center - SRCHCENTERLITE#1",
                "SRCHCENTERLITE#0": "Basic Search Center - SRCHCENTERLITE#0",
                "MPS#1": "Blank Meeting Workspace - MPS#1",
                "STS#1": "Blank Site - STS#1",
                "BLOG#0": "Blog - BLOG#0",
                "BICenterSite#0": "Business Intelligence Center - BICenterSite#0",
                "CENTRALADMIN#0": "Central Admin Site - CENTRALADMIN#0",
                "SPSPORTAL#0": "Collaboration Portal - SPSPORTAL#0",
                "SPSCOMMU#0": "Community area template - SPSCOMMU#0",
                "COMMUNITYPORTAL#0": "Community Portal - COMMUNITYPORTAL#0",
                "COMMUNITY#0": "Community Site - COMMUNITY#0",
                "SPSTOC#0": "Contents area Template - SPSTOC#0",
                "MPS#2": "Decision Meeting Workspace - MPS#2",
                "DEV#0": "Developer Site - DEV#0",
                "BDR#0": "Document Center - BDR#0",
                "STS#2": "Document Workspace - STS#2",
                "EDISC#1": "eDiscovery Case - EDISC#1",
                "EDISC#0": "eDiscovery Center - EDISC#0",
                "SPSPERS#5": "Empty SharePoint Portal Server Personal Space - SPSPERS#5",
                "SRCHCEN#0": "Enterprise Search Center - SRCHCEN#0",
                "ENTERWIKI#0": "Enterprise Wiki - ENTERWIKI#0",
                "GLOBAL#0": "Global template - GLOBAL#0",
                "SGS#0": "Group Work Site - SGS#0",
                "PWS#0": "Microsoft Project Site - PWS#0",
                "MPS#4": "Multipage Meeting Workspace - MPS#4",
                "SPSMSITEHOST#0": "My Site Host - SPSMSITEHOST#0",
                "SPSNEWS#0": "News Site - SPSNEWS#0",
                "SPSNHOME#0": "News Site - SPSNHOME#0",
                "PPSMASite#0": "PerformancePoint - PPSMASite#0",
                "SPSMSITE#0": "Personalization Site - SPSMSITE#0",
                "PowerPivot#0": "PowerPivot Site - PowerPivot#0",
                "BLANKINTERNET#1": "Press Releases Site - BLANKINTERNET#1",
                "PRODUCTCATALOG#0": "Product Catalog - PRODUCTCATALOG#0",
                "PROFILES#0": "Profiles - PROFILES#0",
                "PROJECTSITE#0": "Project Site - PROJECTSITE#0",
                "PWA#0": "Project Web App Site - PWA#0",
                "BLANKINTERNETCONTAINER#0": "Publishing Portal - BLANKINTERNETCONTAINER#0",
                "BLANKINTERNET#0": "Publishing Site - BLANKINTERNET#0",
                "CMSPUBLISHING#0": "Publishing Site - CMSPUBLISHING#0",
                "BLANKINTERNET#2": "Publishing Site with Workflow - BLANKINTERNET#2",
                "OFFILE#1": "Records Center - OFFILE#1",
                "SPSREPORTCENTER#0": "Report Center - SPSREPORTCENTER#0",
                "OSRV#0": "Shared Services Administration Site - OSRV#0",
                "SPSPERS#0": "SharePoint Portal Server Personal Space - SPSPERS#0",
                "SPS#0": "SharePoint Portal Server Site - SPS#0",
                "SPSSITES#0": "Site Directory - SPSSITES#0",
                "MPS#3": "Social Meeting Workspace - MPS#3",
                "SPSPERS#4": "Social Only SharePoint Portal Server Personal Space - SPSPERS#4",
                "SPSPERS#2": "Storage And Social SharePoint Portal Server Personal Space - SPSPERS#2",
                "SPSPERS#3": "Storage Only SharePoint Portal Server Personal Space - SPSPERS#3",
                "STS#0": "Team Site - STS#0",
                "TENANTADMIN#0": "Tenant Admin Site - TENANTADMIN#0",
                "SPSTOPIC#0": "Topic area template - SPSTOPIC#0",
                "visprus#0": "Visio Process Repository - visprus#0",
                "WIKI#0": "Wiki Site - WIKI#0"
            };
        }]);
})();
//Used by ASPIO Controller
var ManagedAccount = /** @class */ (function () {
    function ManagedAccount() {
        this.username = "";
        this.password = "";
        this.commonName = "";
    }
    return ManagedAccount;
}());
var WebApplication = /** @class */ (function () {
    function WebApplication() {
        this.name = "";
        this.type = "";
        this.applicationPool = "";
        this.url = "";
        this.port = "";
        this.useHostHeader = true;
        this.addURLToLocalIntranetZone = true;
        this.grantCurrentUserFullControl = true;
        this.useClaims = true;
        this.useBasicAuthentication = false;
        this.useOnlineWebPartCatalog = false;
        this.managedPaths = new ManagedPaths();
        this.siteCollections = new SiteCollections();
        this.database = new Database();
    }
    return WebApplication;
}());
var SiteCollections = /** @class */ (function () {
    function SiteCollections() {
        this.siteCollection = new Array();
    }
    return SiteCollections;
}());
var SiteCollection = /** @class */ (function () {
    function SiteCollection() {
        this.siteUrl = "";
        this.hostNamedSiteCollection = false;
        this.owner = "";
        this.name = "";
        this.description = "";
        this.customDatabase = "";
        this.searchUrl = "";
        this.template = "";
        this.lcid = "1033";
        this.locale = "en-us";
        this.time24 = false;
    }
    return SiteCollection;
}());
var ManagedPaths = /** @class */ (function () {
    function ManagedPaths() {
        this.managedPath = new Array();
    }
    return ManagedPaths;
}());
var ManagedPath = /** @class */ (function () {
    function ManagedPath() {
        this.relativeUrl = "";
        this.explicit = false;
    }
    return ManagedPath;
}());
var Database = /** @class */ (function () {
    function Database() {
        this.name = "";
        this.server = "";
        this.dbAlias = new DBAlias();
    }
    return Database;
}());
var DBAlias = /** @class */ (function () {
    function DBAlias() {
        this.create = false;
        this.dbInstance = "";
        this.dbPort = "";
    }
    return DBAlias;
}());
// Used by Provision Directive
var ProvisionModel = /** @class */ (function () {
    function ProvisionModel() {
    }
    ProvisionModel.prototype.constricutor = function () {
        this.servers = new Servers();
    };
    return ProvisionModel;
}());
var Servers = /** @class */ (function () {
    function Servers() {
    }
    return Servers;
}());
/// <reference path="../../typings/tsd.d.ts" />
(function () {
    "use strict";
    angular
        .module("ASPIO")
        .directive("ensureExpression", ["$parse", function ($parse) {
            return {
                restrict: "A",
                require: "ngModel",
                link: function (scope, ele, attrs, ngModelController) {
                    function validate() {
                        var expressionResults = $parse(attrs.ensureExpression)(scope);
                        for (var expressionName in expressionResults) {
                            if (expressionResults.hasOwnProperty(expressionName)) {
                                ngModelController.$setValidity(expressionName, expressionResults[expressionName]);
                            }
                        }
                    }
                    scope.$watch(attrs.ngModel, function () {
                        validate();
                    });
                    if ("ensureWatch" in attrs) {
                        scope.$watch(attrs.ensureWatch, function () {
                            validate();
                        });
                    }
                    if ("ensureWatchDeep" in attrs) {
                        scope.$watch(attrs.ensureWatchDeep, function () {
                            validate();
                        }, true);
                    }
                    if ("ensureWatchCollection" in attrs) {
                        scope.$watchCollection(attrs.ensureWatchCollection, function () {
                            validate();
                        });
                    }
                }
            };
        }]);
})();
/// <reference path="../../typings/tsd.d.ts" />
(function () {
    "use strict";
    var IntegerValidator = /** @class */ (function () {
        function IntegerValidator() {
            this.restrict = "A";
            this.require = "ngModel";
            this.link = function (scope, element, attrs, ngModelController) {
                var INTEGER_REGEXP = /^\-?\d+$/;
                ngModelController.$validators.integer = function (modelValue, viewValue) {
                    if (ngModelController.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }
                    if (INTEGER_REGEXP.test(viewValue)) {
                        // it is valid
                        return true;
                    }
                    // it is invalid
                    return false;
                };
            };
        }
        IntegerValidator.factory = function () {
            var directive = function () { return new IntegerValidator(); };
            return directive;
        };
        return IntegerValidator;
    }());
    angular
        .module("ASPIO")
        .directive("integer", IntegerValidator.factory());
})();
/// <reference path="../../typings/tsd.d.ts" />
(function () {
    "use strict";
    var FileRead = /** @class */ (function () {
        function FileRead() {
            this.restrict = "A";
            this.scope = {
                onReadFile: "&"
            };
            this.link = function (scope, element) {
                element.on("change", function (e) {
                    var files = e.target.files;
                    var file = files[0];
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        scope.$apply(function () {
                            scope.onReadFile({ data: e.target.result });
                        });
                    };
                    reader.readAsText(file);
                });
            };
        }
        FileRead.factory = function () {
            var directive = function () { return new FileRead(); };
            return directive;
        };
        return FileRead;
    }());
    angular
        .module("ASPIO")
        .directive("onReadFile", FileRead.factory());
})();
/// <reference path="../../typings/tsd.d.ts" />
(function () {
    "use strict";
    angular
        .module("ASPIO")
        .directive("ngProvision", [function () {
            return {
                restrict: "E",
                scope: {
                    ngModel: "=",
                    servers: "="
                },
                template: "<label class='radio-inline' ng-if='servers.length === 0' uib-tooltip='Provision'>" +
                    "<input type='radio' ng-model='model.provision' value='localhost' /> Provision" +
                    "</label>" +
                    "<label class='radio-inline' ng-if='servers.length > 0' uib-tooltip='Provision on all'>" +
                    "<input type='radio' ng-model='model.provision' value='localhost' /> Provision on all" +
                    "</label>" +
                    "<label class='radio-inline' uib-tooltip='Do not Provision'>" +
                    "<input type='radio' ng-model='model.provision' value='false' /> Do not Provision" +
                    "</label>" +
                    "<br />" +
                    "<label class='checkbox-inline' ng-repeat='server in servers' uib-tooltip='Provision on {{ server }}'>" +
                    "<input type='checkbox' ng-model='model.servers[server]' /> {{ server }}" +
                    "</label>",
                controller: function ($scope) {
                    // replace true with localhost as script doesn't work without it
                    if ($scope.ngModel !== undefined && $scope.ngModel.toLowerCase() === "true") {
                        $scope.ngModel = "localhost";
                    }
                    // Grab current values from the provision fields and it to the servers collection
                    // Ignore if it equals any of the following keywords
                    if ($scope.ngModel !== undefined && $scope.ngModel.toLowerCase() !== "false" && $scope.ngModel.toLowerCase() !== "localhost" && $scope.ngModel.toLowerCase() !== "") {
                        var serversArray = $scope.ngModel.replace(/ /g, ",").toUpperCase().split(",");
                        for (var i = 0, len = serversArray.length; i < len; i++) {
                            if ($scope.servers.indexOf(serversArray[i]) === -1) {
                                $scope.servers.push(serversArray[i]);
                            }
                        }
                    }
                    // define model
                    var model = new ProvisionModel();
                    model.servers = new Servers();
                    for (var i2 = 0, len2 = $scope.servers.length; i2 < len2; i2++) {
                        model.servers[$scope.servers[i2]] = false;
                    }
                    $scope.model = model;
                    // Sets the Controls values based on current value
                    function updateControls() {
                        if ($scope.ngModel === undefined) {
                            return;
                        }
                        if ($scope.ngModel.toLowerCase() === "localhost" || $scope.ngModel.toLowerCase() === "false") {
                            $scope.model.provision = $scope.ngModel.toLowerCase();
                        }
                        else {
                            // Assume we are dealing with a list of servers
                            var configServers = $scope.ngModel.replace(/ /g, ",").toUpperCase().split(",");
                            var resetModel = true;
                            var tempValue = "";
                            for (var i = 0, len = configServers.length; i < len; i++) {
                                if ($scope.servers.indexOf(configServers[i]) !== -1) {
                                    $scope.model.servers[configServers[i]] = true;
                                    if (tempValue.length >= 1) {
                                        tempValue += "," + configServers[i];
                                    }
                                    else {
                                        tempValue = configServers[i];
                                    }
                                    resetModel = false;
                                }
                            }
                            // Reset the Model if no servers match the current value
                            if (resetModel) {
                                $scope.ngModel = "";
                            }
                            else {
                                // Set the Model to the current list of matched servers. In cause the field had a server not found in server list
                                $scope.ngModel = tempValue;
                            }
                        }
                    }
                    updateControls();
                    // Keep an eye on our list of servers, if it changes unmatched entries should be removed
                    $scope.$watchCollection("servers", function () {
                        updateControls();
                    });
                    $scope.$watch("model.provision", function (newValue, oldValue) {
                        if (newValue === oldValue || newValue === "") {
                            return;
                        }
                        $scope.ngModel = $scope.model.provision;
                        // All others should be unchecked
                        for (var i = 0, len = $scope.servers.length; i < len; i++) {
                            $scope.model.servers[$scope.servers[i]] = false;
                        }
                    });
                    $scope.$watchCollection("model.servers", function (newValue, oldValue) {
                        if (angular.equals(oldValue, newValue)) {
                            return;
                        }
                        // Check if any Servers are Checked, otherwise we wont run
                        var shouldRun = false;
                        for (var i = 0, len = $scope.servers.length; i < len; i++) {
                            if ($scope.model.servers[$scope.servers[i]] === true) {
                                shouldRun = true;
                            }
                        }
                        if (shouldRun) {
                            // All others should be unchecked
                            $scope.model.provision = "";
                            var tempValue = "";
                            for (var i2 = 0, len2 = $scope.servers.length; i2 < len2; i2++) {
                                if ($scope.model.servers[$scope.servers[i2]] === true) {
                                    if (tempValue.length >= 1) {
                                        tempValue += "," + $scope.servers[i2];
                                    }
                                    else {
                                        tempValue = $scope.servers[i2];
                                    }
                                }
                            }
                            $scope.ngModel = tempValue;
                        }
                        else if ($scope.model.provision === "") {
                            // Provision Radio is unchecked, and all Server checkboxes are unchecked
                            $scope.ngModel = "";
                        }
                    });
                }
            };
        }]);
})();
/// <reference path="../../typings/tsd.d.ts" />
(function () {
    "use strict";
    var StringToNumber = /** @class */ (function () {
        function StringToNumber() {
            this.restrict = "A";
            this.require = "ngModel";
            this.link = function (scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function (value) {
                    if (value === null) {
                        return "";
                    }
                    return "" + value;
                });
                ngModelController.$formatters.push(function (value) {
                    return parseFloat(value);
                });
            };
        }
        StringToNumber.factory = function () {
            var directive = function () { return new StringToNumber(); };
            return directive;
        };
        return StringToNumber;
    }());
    angular
        .module("ASPIO")
        .directive("stringToNumber", StringToNumber.factory());
})();
/// <reference path="../../typings/tsd.d.ts" />
(function () {
    "use strict";
    function xmlService() {
        this.config = null;
        this.context = new Jsonix.Context([ConfigModel]);
        this.LoadXml = function (xml) {
            var unmarshaller = this.context.createUnmarshaller();
            this.config = unmarshaller.unmarshalString(xml);
        };
        this.GetXml = function () {
            var marshaller = this.context.createMarshaller();
            return vkbeautify.xml(marshaller.marshalString(this.config));
        };
        // Public Functions
        this.UpgrdeXml398to399 = function (xml) {
            var context = new Jsonix.Context([ConfigModel398]);
            var unmarshaller = context.createUnmarshaller();
            this.config = unmarshaller.unmarshalString(xml);
            this.Upgrde398to399();
        };
        this.UpgrdeXml399to3995 = function (xml) {
            var context = new Jsonix.Context([ConfigModel399]);
            var unmarshaller = context.createUnmarshaller();
            this.config = unmarshaller.unmarshalString(xml);
            this.Upgrde399to3995();
        };
        this.UpgrdeXml3995to39951 = function (xml) {
            var context = new Jsonix.Context([ConfigModel3995]);
            var unmarshaller = context.createUnmarshaller();
            this.config = unmarshaller.unmarshalString(xml);
            this.Upgrde3995to39951();
        };
        this.UpgrdeXml39951to39960 = function (xml) {
            var context = new Jsonix.Context([ConfigModel39951]);
            var unmarshaller = context.createUnmarshaller();
            this.config = unmarshaller.unmarshalString(xml);
            this.Upgrde39951to39960();
        };
        // Multi version jumps
        this.UpgrdeXml398toLatest = function (xml) {
            this.UpgrdeXml398to399(xml);
            this.Upgrde399to3995();
            this.Upgrde3995to39951();
            this.Upgrde39951to39960();
        };
        this.UpgrdeXml399toLatest = function (xml) {
            this.UpgrdeXml399to3995(xml);
            this.Upgrde3995to39951();
            this.Upgrde39951to39960();
        };
        this.UpgrdeXml3995toLatest = function (xml) {
            this.UpgrdeXml3995to39951(xml);
            this.Upgrde3995to39951();
            this.Upgrde39951to39960();
        };
        // Private Functions
        this.Upgrde398to399 = function () {
            this.config.value.version = "3.99";
            if (this.config.value.serviceApps.enterpriseSearchService.enterpriseSearchServiceApplications.enterpriseSearchServiceApplication.proxy.proxyGroup.name !== undefined) {
                this.config.value.serviceApps.enterpriseSearchService.enterpriseSearchServiceApplications.enterpriseSearchServiceApplication.proxy.proxyGroup = this.config.value.serviceApps.enterpriseSearchService.enterpriseSearchServiceApplications.enterpriseSearchServiceApplication.proxy.proxyGroup.name;
            }
        };
        this.Upgrde399to3995 = function () {
            this.config.value.version = "3.99.5";
            if (this.config.value.farm.serverRoles === undefined) {
                this.config.value.farm.serverRoles = new Object;
                this.config.value.farm.serverRoles.specialLoad = new Object;
                this.config.value.farm.serverRoles.specialLoad.provision = "false";
                this.config.value.farm.serverRoles.webFrontEnd = new Object;
                this.config.value.farm.serverRoles.webFrontEnd.provision = "false";
                this.config.value.farm.serverRoles.singleServerFarm = new Object;
                this.config.value.farm.serverRoles.singleServerFarm.provision = "false";
                this.config.value.farm.serverRoles.search = new Object;
                this.config.value.farm.serverRoles.search.provision = "false";
                this.config.value.farm.serverRoles.application = new Object;
                this.config.value.farm.serverRoles.application.provision = "false";
                this.config.value.farm.serverRoles.distributedCache = new Object;
                this.config.value.farm.serverRoles.distributedCache.provision = "false";
            }
        };
        this.Upgrde3995to39951 = function () {
            this.config.value.version = "3.99.51";
            this.config.value.farm.serverRoles.custom = new Object;
            this.config.value.farm.serverRoles.custom.provision = this.config.value.farm.serverRoles.specialLoad.provision;
        };
        this.Upgrde39951to39960 = function () {
            this.config.value.version = "3.99.60";
            this.config.value.farm.serverRoles.webFrontEndWithDistributedCache = new Object;
            this.config.value.farm.serverRoles.webFrontEndWithDistributedCache.provision = "false";
            this.config.value.farm.serverRoles.applicationWithSearch = new Object;
            this.config.value.farm.serverRoles.applicationWithSearch.provision = "false";
        };
    }
    angular
        .module("ASPIO")
        .service("xmlService", xmlService);
})();
