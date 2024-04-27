import './Layout.css'
import MapComponent from '../MapComponent/MapComponent'


export default function Layout() {

    return (
        <>
            <header>Сервис подсчета населения на
                произвольно заданной территории России.</header>
            <MapComponent />
            <footer><div> &copy; Antoshchenko Georgii 2024</div></footer>
        </>
    )
}
