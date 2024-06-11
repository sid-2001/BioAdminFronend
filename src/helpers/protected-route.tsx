import { Navigate } from "react-router-dom";

import { LocalStorageService } from "@/helpers/local-storage-service";

export type ProtectedRouteProps = {
  authenticationPath: string;
  outlet: JSX.Element;
};

function ProtectedRoute({ authenticationPath, outlet }: ProtectedRouteProps) {
  const localstorageService = new LocalStorageService();

  const isAuthenticated = localstorageService.get_accesstoken();

  if (isAuthenticated) {
    return outlet;
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />;
  }
}

export default ProtectedRoute;
