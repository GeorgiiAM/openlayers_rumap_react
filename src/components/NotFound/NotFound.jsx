import { Link } from 'react-router-dom'
import './NotFound.css'


export default function NotFound() {
    return (
        <div className='notFound'>
            Страница не существует.
            <Link to="/">Вернуться на домашнюю страницу</Link>
        </div>
    )
}