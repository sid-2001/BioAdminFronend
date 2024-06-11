import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import TestPage from './pages/test'
import SharedLayout from './components/shared-layout'
import ForgetPasswordResetPage from './pages/forget-password-reset'
import ForgetPasswordPage from './pages/forget-password'
import ProtectedRoute, { ProtectedRouteProps } from './helpers/protected-route'

// Client Pages
import ClientsPage from './pages/clients'
import ClientDetailsPage from './pages/client-details'
import ClientOverviewPage from './pages/client-overview'

// Project Pages
import ProjectDetailsPage from './pages/project-details'
import ProjectsPage from './pages/projects'
import ProjectPage from './pages/project'
// import ProjectThreadsPage from "./pages/project-threads";
import ProjectThreadChatsPage from './pages/project-thread-chats'
import ProjectFilePage from '@/pages/project-file'

// Supplier pages
import SuppliersPage from './pages/suppliers'
import SupplierDetailsPage from './pages/supplier-details'
import SupplierOverviewPage from './pages/supplier-overview'

import TemplatesPage from './pages/templates'
// import UsersPage from "./pages/users";
import SurveyBuilderPage from './pages/survey-builder'
import IndexPage from './pages/index/index.page'
import TeamMemberPage from './pages/team-member/team-member.page'
import UserDetailPage from './pages/user-details/user.details.page'
// import UserDetailsContainer from "./containers/user-details/user.details.container";

// Request Pages
import RequestPage from './pages/request'
import DataPage from './pages/data'
import AdminPermissionsPage from './pages/admin-permissions/admin-permissions.page'
import SummaryContainer from './containers/project-summary/project-summary.container'
import EstimatesContainer from './containers/project-estimates/project-estimates.container'
import TeamMemberTableContainer from './containers/project-members/update-team-members'
// import JobsContainer from "./containers/project-jobs/project-jobs.container";
import ProjectDataNavigationContainer from './containers/project-data-navigation/project-data-navigation.container'
import TabulationPage from './pages/tabulation'

import SurveysPage from '@/pages/surveys'
import SurveyDetailsPage from '@/pages/survey-details'
import SurveyOverviewPage from '@/pages/survey-overview'
import SurveySecurityContainer from '@/containers/survey-security'

import LayoutsPage from './pages/layouts'
import LayoutDetailsPage from './pages/layout-details'
import LayoutOverviewPage from './pages/layout-overview'
// import InviteProjectTeamMemberPage from "./pages/invite-project-member";
import SurveyQuotaPage from './pages/survey-quota'
import SurveySuppliesContainer from '@/containers/survey-supplies'
// import MembersContainer from "./containers/project-members/project-members.container"
// import TeamMemberTableContainer from "./containers/project-members/update-team-members";
import BannerPlannerPage from '@/pages/banner-planner'
import PipelinesPage from './pages/pipelines'
import SurveyQualificationPage from './pages/survey-qualification'
import ChartsConfigPage from './pages/charts-config'
import UserVerifyPage from './pages/user-verify'
import UserInvitePage from './pages/invite-user'
import ProjectSurveyContainer from './containers/project-survey'
import ProjectSurveyNavigation from './containers/project-survey/project-survey-navigation'
import ProjectDataNavigationPublishedContainer from './containers/project-data-navigation-published/project-data-navigation-published.container'
import DataValidationPage from './pages/data-validation'
import PipelinesCreatePage from './pages/pipelines-create'
import PipelinesUpdatePage from './pages/pipelines-update'
import PipelinesRunsPage from './pages/pipelines-runs'
import TabulationPublishedPage from './pages/tabulation-published'
import StatisticsPage from './pages/statistics'
import DataInsightsContainer from './containers/data-insights'
import OtaContainer from './containers/ota'
import NestedQuotaPage from './pages/nested-quota'
import SupplierSetupPage from './pages/supplier-setup'
import VisualizationsPage from './pages/visualizations'
import VisualizationsCreatePage from './pages/visualizations-create'
import VisualizationsUpdatePage from './pages/visualizations-update'
import SupplierPragmaticConfigurationPage from './pages/supplier-pragmatic-configuration/supplier-pragmatic-configuration.page'
import TenantsPage from './pages/tenants'
import TenantOverviewPage from './pages/tenant-overview'
import TenantDetailsPage from './pages/tenant-details/tenant-details.page'
import SurveyReportsPage from './pages/survey-reports'

function App() {
  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    authenticationPath: '/login',
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<SharedLayout />} />}>
            <Route index element={<IndexPage />} />
            <Route path="layouts" element={<LayoutsPage />}>
              <Route path=":layoutId" element={<LayoutDetailsPage />}>
                <Route index element={<Navigate to="overview" />} />
                <Route path="overview" element={<LayoutOverviewPage />} />
              </Route>
            </Route>
            <Route path="clients" element={<ClientsPage />}>
              <Route path=":clientId" element={<ClientDetailsPage />}>
                <Route index element={<Navigate to="overview" />} />
                <Route path="overview" element={<ClientOverviewPage />} />
              </Route>
            </Route>
            <Route path="surveys" element={<SurveysPage />}>
              <Route path=":surveyId" element={<SurveyDetailsPage />}>
                <Route index element={<Navigate to="overview" />} />
                <Route path="overview" element={<SurveyOverviewPage />} />
                <Route path="qualification" element={<SurveyQualificationPage />} />
                <Route path="quotas" element={<SurveyQuotaPage />} />
                <Route path="supply" element={<SurveySuppliesContainer />} />
                <Route path="security" element={<SurveySecurityContainer />} />
                <Route path="reports" element={<SurveyReportsPage />} />
              </Route>
            </Route>
            <Route path='tenants' element={<TenantsPage/>}>
            <Route path=":tenantId" element={<TenantDetailsPage />}>
                <Route index element={<Navigate to="overview" />} />
                <Route path="overview" element={<TenantOverviewPage />} />
                </Route>
            </Route>
            <Route path="suppliers" element={<SuppliersPage />}>
              <Route path=":supplierId" element={<SupplierDetailsPage />}>
                <Route index element={<Navigate to="overview" />} />
                <Route path="overview" element={<SupplierOverviewPage />} />
                <Route path="configuration" element={<SupplierSetupPage />} />
                <Route path="programmatic-configuration" element={<SupplierPragmaticConfigurationPage />} />
              </Route>
            </Route>
            <Route path="projects" element={<ProjectsPage />}>
              <Route path=":projectId" element={<ProjectPage />}>
                <Route index element={<Navigate to="overview" />} />
                <Route path="overview" element={<ProjectDetailsPage />} />
                {/* <Route path="threads" element={<ProjectThreadsPage />} /> */}
                {/* <Route path="survey/:surveyId/estimates" element={<EstimatesContainer />} /> */}
                <Route path="survey/:surveyId/threads" element={<ProjectThreadChatsPage />} />
                <Route path="survey/:surveyId/builder" element={<SurveyBuilderPage />} />
                {/* <Route path="requests" element={<RequestPage />} /> */}
                <Route path="survey/:surveyId/files" element={<ProjectFilePage />} />
                <Route path="survey/:surveyId/estimates" element={<EstimatesContainer />} />

                <Route path="survey/:surveyId/data" element={<ProjectDataNavigationContainer />}>
                  <Route index element={<Navigate to="summary" replace />} />
                  <Route path="summary" element={<SummaryContainer />} />
                  <Route path="jobs" element={<DataPage />} />
                  <Route path="data-tabulation" element={<TabulationPage />} />
                  <Route path="pipelines" element={<PipelinesPage />}>
                    <Route path="new" element={<PipelinesCreatePage />} />
                    <Route path=":pipelineId/update" element={<PipelinesUpdatePage />} />
                    <Route path=":pipelineId/runs" element={<PipelinesRunsPage />}>
                      <Route path=":runId" element={<ProjectDataNavigationPublishedContainer />}>
                        <Route index element={<Navigate to="data-tabulation" replace />} />
                        {/* New Route  */}
                        {/* <Route path='data-cleaning' element={<SummaryContainer />} />
                  <Route path='jobs' element={<DataPage />} /> */}
                        <Route path="data-tabulation" element={<TabulationPublishedPage />} />
                        <Route path="data-statistics" element={<StatisticsPage />} />
                        {/* <Route
                          path="data-tabulation"
                          element={<TabulationPublishedPage />}
                        /> */}
                        <Route path="data-insights" element={<DataInsightsContainer />} />
                        <Route path="ota-analysis" element={<OtaContainer />} />
                        {/* <Route path='data-statistics' element={<StatisticsPage />} /> */}

                        {/* <Route
                    path='config/cleaning'
                    element={<AnalysisCleaningPage />}
                  />
                  <Route
                    path='config/banner'
                    element={<AnalysisBannerPage />}
                  />
                  <Route
                    path='config/tabulation'
                    element={<AnalysisTabulationPage />}
                  />
                  <Route
                    path='config/exports'
                    element={<AnalysisExportsPage />}
                  />*/}
                        <Route path="data-validation" element={<DataValidationPage />} />
                        {/* <Route path="data-tabulation" element={<DataTabulationPage />} /> */}
                      </Route>
                    </Route>
                  </Route>
                  <Route path="schema-manager" element={<ChartsConfigPage />} />
                  <Route path="banner-planner" element={<BannerPlannerPage />} />

                  <Route path="data-visualization" element={<VisualizationsPage />}>
                    <Route path="new" element={<VisualizationsCreatePage />} />
                    <Route path=":visualizationId/update" element={<VisualizationsUpdatePage />} />
                  </Route>
                </Route>
                {/* -- */}

                <Route path="members" element={<TeamMemberTableContainer />} />
                <Route path="surveys" element={<ProjectSurveyContainer />}>
                  <Route path=":surveyId" element={<ProjectSurveyNavigation />}>
                    <Route index element={<Navigate to="overview" />} />
                    <Route path="overview" element={<SurveyOverviewPage />} />
                    <Route path="qualification" element={<SurveyQualificationPage />} />
                    {/* <Route path="quotas" element={<SurveyQuotaPage />} /> */}
                    <Route path="quota" element={<NestedQuotaPage />} />
                    <Route path="supply" element={<SurveySuppliesContainer />} />
                    <Route path="security" element={<SurveySecurityContainer />} />
                    <Route path="reports" element={<SurveyReportsPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="projects" element={<ProjectsPage />}>
              <Route path=":projectId" element={<ProjectPage />}>
                <Route index element={<Navigate to="overview" />} />
                <Route path="overview" element={<ProjectDetailsPage />} />
                {/* <Route path="threads" element={<ProjectThreadsPage />} /> */}
                <Route path="threads" element={<ProjectThreadChatsPage />} />
                <Route path="builder" element={<SurveyBuilderPage />} />
                <Route path="requests" element={<RequestPage />} />
                <Route path="survey/:surveyId/files" element={<ProjectFilePage />} />
                <Route path="data" element={<DataPage />} />
              </Route>
            </Route>
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="users" element={<TeamMemberPage />}>
              <Route path=":userId" element={<UserDetailPage />} />
            </Route>
            <Route path="permissions" element={<AdminPermissionsPage />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="/password-recovery" element={<ForgetPasswordPage />} />
          <Route path="/verify" element={<UserVerifyPage />} />
          <Route path="/user-invitation" element={<UserInvitePage />} />
          <Route path="/forget-password" element={<ForgetPasswordResetPage />} />
          <Route path="test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
