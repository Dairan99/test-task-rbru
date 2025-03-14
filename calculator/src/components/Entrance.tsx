import { useDispatch } from "react-redux"
import { openCalculation } from "../store/slice"
import styles from "../../css/blocks/entrance.module.css"


export const Entrance = () => {
    const dispatch = useDispatch()

    const handleButtonClick = () => {
        dispatch(openCalculation())
    }

    return (
            <div className={styles.entrance}>
                <div className="container">
                   <div className={styles.entrance__wrapper}>
                       <h1 className={styles.entrance__title}>Калькулятор обоев</h1>
                       <p className={styles.entrance__text}>Онлайн-калькулятор расчета обоев по поможет вам определить число рулонов, требуемых для оклеивания, с учетом окон и дверей. Чтобы получить точные результаты, просто укажите параметры помещения и размеры в специальной таблице. Наша программа также берет в учет повторение рисунка (раппорт), что позволяет оптимизировать расходы на материалы и клей.</p>
                       <button className={`${styles.entrance__button} btn`} onClick={handleButtonClick}>
                            <svg className={styles.entrance__icon} width='22' height='22'>
                                <use xlinkHref='/public/sprite.svg#icon'></use>
                            </svg>
                            <span className={styles.entrance__textButton}>Начать расчет материалов</span>
                        </button>
                   </div>
                </div>
            </div>
        
    )
}

export default Entrance