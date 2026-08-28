import { NavLink } from "react-router-dom"
import { RoutesNames } from "../routes"
import type { CSSProperties } from "react"

export const getNavStyle = ({isActive}: {isActive: boolean}): CSSProperties => ({
    color: isActive ? '#1890ff' : '#ffffffa6',
    fontWeight: isActive ? 600 : 400,
    fontSize: '14px',
    padding: '6px 12px',
    border: isActive ? '1px solid teal' : 'transparent',
    boxShadow: isActive ? '0 0 10px rgba(0, 242, 254, 0.6), inset 0 0 5px rgba(0, 242, 254, 0.2)' : 'none',
    borderRadius: '5px',
    lineHeight: '20px',
    transition: 'all 0.2s',
    cursor: 'pointer',
})

export const Navbar = () => {
    return (
        <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px', 
            padding: '10px 24px',
            height: '64px',
            background: '#001529', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)' 
            }}> 
            <NavLink to={RoutesNames.BOOKS} style={getNavStyle}>
                Add Book
            </NavLink>
            <NavLink to={RoutesNames.BOOKLIST} style={getNavStyle}>
                My Books
            </NavLink>
        </div>
    )
}