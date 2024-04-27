import { Link, useRouteError } from 'react-router-dom'
import './ErrorPage.css'


export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);
    //   return <div>{error.message}</div>;
    return (
        <div className='errorPage'>
            <div>Номер ошибки: {error.status}</div>
            <div>Текст ошибки: {error.statusText}</div>
            <Link to="/">Вернуться на домашнюю страницу</Link>
        </div >
    )
}