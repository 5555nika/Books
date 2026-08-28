import { Navigate, Route, Routes } from "react-router-dom"
import { publicRouter, RoutesNames } from "../routes"

export const AppRouter = () => {
    return (
        <Routes>
            {publicRouter.map(route => 
                <Route key={route.path} path={route.path} element={route.element} />
            )}

            <Route path="*" element={ <Navigate to={RoutesNames.BOOKS} replace />} />
        </Routes>
    )
}