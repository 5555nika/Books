import type { ReactNode } from "react"
import { BookList } from "./pages/BookList"
import { Books } from "./pages/Books"


export interface IRoute {
    path: string,
    element: ReactNode
}

export const RoutesNames = {
    BOOKS: '/',
    BOOKLIST: '/booklist'
}

export const publicRouter: IRoute[] = [
    { path: RoutesNames.BOOKS, element: <Books /> },
    { path: RoutesNames.BOOKLIST, element: <BookList /> }
]


