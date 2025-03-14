import { ChangeEvent, useState } from "react"
import styles from "../../css/blocks/calculation.module.css"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { closeCalculation } from "../store/slice";

interface IWindowType {
    id: number;
    height: number | string;
    width: number | string;
}

export const Calculation = () => {
    const dispatch = useDispatch()

    const [parametrsRoll, setParametrsRoll] = useState<string>("normal")
    const [rapport, setRapport] = useState<"small" | "normal" | "big">("small");
    const [rapportValue, setRapportValue] = useState(0)
    const [addWindow, setAddWindow] = useState<IWindowType[]>([])
    const [addDoor, setAddDoor] = useState<IWindowType[]>([])
    const [rollsNeeded, setRollsNeeded] = useState(0)
    const [wallpaperArea, setWallpaperArea] = useState(0)
    const [wallArea, setWallArea] = useState(0)
    const [openResult, setOpenResult] = useState(false)
    const [openСalculation, setOpenCalculation] = useState(true)

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const handleButtonClickBack = () => {
        dispatch(closeCalculation())
    }

    const onSubmit = (data: any) => {
        const length = parseFloat(data.length)
        const width = parseFloat(data.width)
        const height = parseFloat(data.height)

        if (isNaN(length) || isNaN(width) || isNaN(height)) {
            alert("Пожалуйста, введите корректные размеры комнаты.");
            return;
        }

        const rollWidthValue: number = parametrsRoll === "normal" ? 1.06 : 1.06
        const rollLengthValue: number = parametrsRoll === "normal" ? 10 : 25

        const perimeter = 2 * (length + width);
        let wallAreaValue = perimeter * height;

        const totalWindowDoorArea = calculateTotalWindowDoorArea()
        wallAreaValue -= totalWindowDoorArea

        const usableRollLength = rollLengthValue - rapportValue;
        const rollArea = rollWidthValue * usableRollLength;
        const stripsPerRoll = height === 0 ? 0 : Math.floor(usableRollLength / height);
        const totalStripsNeeded = rollWidthValue === 0 ? 0 : Math.ceil(perimeter / rollWidthValue);
        const rollsNeededValue = stripsPerRoll === 0 ? 0 : Math.ceil(totalStripsNeeded / stripsPerRoll);
        const totalWallpaperArea = rollsNeededValue * rollArea;

        setRollsNeeded(rollsNeededValue);
        setWallpaperArea(totalWallpaperArea);
        setWallArea(wallAreaValue);

        setOpenCalculation(false);
        setOpenResult(true);
    }

    const handleButtonClick = (value: string) => {
        setParametrsRoll(value)
    }

    const handleButtonRapportClick = (rapportType: "small" | "normal" | "big") => {
        setRapport(rapportType);

        let rapportNumber: number;
        switch (rapportType) {
            case "small":
                rapportNumber = 0;
                break;
            case "normal":
                rapportNumber = 0.32;
                break;
            case "big":
                rapportNumber = 0.64;
                break;
            default:
                rapportNumber = 0;
        }

        setRapportValue(rapportNumber);
    };

    const addWindowHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAddWindow([...addWindow, { id: Date.now(), height: 0, width: 0 }])
    }

    const removeWindowHandler = (id: number) => {
        setAddWindow(addWindow.filter((addWindow) => addWindow.id !== id))
    }

    const addDoorHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setAddDoor([...addDoor, { id: Date.now(), height: 0, width: 0 }])
    }

    const removeDoorHandler = (id: number) => {
        setAddDoor(addDoor.filter((addDoor) => addDoor.id !== id))
    }

    const handleWindowHeightChange = (id: number, event: ChangeEvent<HTMLInputElement>) => {
        setAddWindow(addWindow.map(window =>
            window.id === id ? { ...window, height: parseFloat(event.target.value) } : window
        ));
    };

    const handleWindowWidthChange = (id: number, event: ChangeEvent<HTMLInputElement>) => {
        setAddWindow(addWindow.map(window =>
            window.id === id ? { ...window, width: parseFloat(event.target.value) } : window))
    }

    const handleDoorHeightChange = (id: number, event: ChangeEvent<HTMLInputElement>) => {
        setAddDoor(addDoor.map(door =>
            door.id === id ? { ...door, height: parseFloat(event.target.value) } : door
        ));
    };

    const handleDoorWidthChange = (id: number, event: ChangeEvent<HTMLInputElement>) => {
        setAddDoor(addDoor.map(door =>
            door.id === id ? { ...door, width: parseFloat(event.target.value) } : door))
    }

    const calculateTotalWindowDoorArea = () => {
        let totalArea = 0;
        addWindow.forEach(window => {
            // Преобразуем height и width в числа
            const height = typeof window.height === 'string' ? parseFloat(window.height) : window.height;
            const width = typeof window.width === 'string' ? parseFloat(window.width) : window.width;
            totalArea += (height || 0) * (width || 0);
        });
        addDoor.forEach(door => {
            // Преобразуем height и width в числа
            const height = typeof door.height === 'string' ? parseFloat(door.height) : door.height;
            const width = typeof door.width === 'string' ? parseFloat(door.width) : door.width;
            totalArea += (height || 0) * (width || 0);
        });
        return totalArea;
    };



    const handleReset = () => {
        reset();
        setAddWindow([]);
        setAddDoor([]);
        setRollsNeeded(0);
        setWallpaperArea(0);
        setWallArea(0);
        setOpenCalculation(true)
        setOpenResult(false)
    };

    return (
        <div className={styles.calculation}>
            <button className={styles.calculationForm__IconCrossButton} onClick={handleButtonClickBack}>
                <svg className={styles.calculationForm__windowIconCross} width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.293041 15.293L6.58604 9L0.293041 2.707C0.110883 2.5184 0.0100885 2.2658 0.0123669 2.0036C0.0146453 1.74141 0.119815 1.49059 0.305223 1.30519C0.490631 1.11978 0.741443 1.01461 1.00364 1.01233C1.26584 1.01005 1.51844 1.11085 1.70704 1.29301L8.00004 7.58601L14.293 1.29301C14.3853 1.19749 14.4956 1.12131 14.6176 1.0689C14.7396 1.01649 14.8709 0.988908 15.0036 0.987754C15.1364 0.986601 15.2681 1.0119 15.391 1.06218C15.5139 1.11246 15.6255 1.18672 15.7194 1.28061C15.8133 1.3745 15.8876 1.48615 15.9379 1.60905C15.9881 1.73195 16.0134 1.86363 16.0123 1.99641C16.0111 2.12919 15.9836 2.26041 15.9311 2.38241C15.8787 2.50441 15.8026 2.61476 15.707 2.707L9.41404 9L15.707 15.293C15.8026 15.3853 15.8787 15.4956 15.9311 15.6176C15.9836 15.7396 16.0111 15.8708 16.0123 16.0036C16.0134 16.1364 15.9881 16.2681 15.9379 16.391C15.8876 16.5139 15.8133 16.6255 15.7194 16.7194C15.6255 16.8133 15.5139 16.8875 15.391 16.9378C15.2681 16.9881 15.1364 17.0134 15.0036 17.0123C14.8709 17.0111 14.7396 16.9835 14.6176 16.9311C14.4956 16.8787 14.3853 16.8025 14.293 16.707L8.00004 10.414L1.70704 16.707C1.51844 16.8892 1.26584 16.99 1.00364 16.9877C0.741443 16.9854 0.490631 16.8802 0.305223 16.6948C0.119815 16.5094 0.0146453 16.2586 0.0123669 15.9964C0.0100885 15.7342 0.110883 15.4816 0.293041 15.293Z" fill="#526EFF" />
                </svg>
            </button>
            <div className="container">
                <form className={styles.calculationForm} onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className={styles.calculationForm__group}>
                        <div className={styles.calculationForm__groupCrossFlex}>
                            <legend className={styles.calculationForm__groupName}>Параметры комнаты</legend>
                            <button className={styles.calculationForm__IconCrossButtonFlex} onClick={handleButtonClickBack}>
                                <svg className={styles.calculationForm__windowIconCross} width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.293041 15.293L6.58604 9L0.293041 2.707C0.110883 2.5184 0.0100885 2.2658 0.0123669 2.0036C0.0146453 1.74141 0.119815 1.49059 0.305223 1.30519C0.490631 1.11978 0.741443 1.01461 1.00364 1.01233C1.26584 1.01005 1.51844 1.11085 1.70704 1.29301L8.00004 7.58601L14.293 1.29301C14.3853 1.19749 14.4956 1.12131 14.6176 1.0689C14.7396 1.01649 14.8709 0.988908 15.0036 0.987754C15.1364 0.986601 15.2681 1.0119 15.391 1.06218C15.5139 1.11246 15.6255 1.18672 15.7194 1.28061C15.8133 1.3745 15.8876 1.48615 15.9379 1.60905C15.9881 1.73195 16.0134 1.86363 16.0123 1.99641C16.0111 2.12919 15.9836 2.26041 15.9311 2.38241C15.8787 2.50441 15.8026 2.61476 15.707 2.707L9.41404 9L15.707 15.293C15.8026 15.3853 15.8787 15.4956 15.9311 15.6176C15.9836 15.7396 16.0111 15.8708 16.0123 16.0036C16.0134 16.1364 15.9881 16.2681 15.9379 16.391C15.8876 16.5139 15.8133 16.6255 15.7194 16.7194C15.6255 16.8133 15.5139 16.8875 15.391 16.9378C15.2681 16.9881 15.1364 17.0134 15.0036 17.0123C14.8709 17.0111 14.7396 16.9835 14.6176 16.9311C14.4956 16.8787 14.3853 16.8025 14.293 16.707L8.00004 10.414L1.70704 16.707C1.51844 16.8892 1.26584 16.99 1.00364 16.9877C0.741443 16.9854 0.490631 16.8802 0.305223 16.6948C0.119815 16.5094 0.0146453 16.2586 0.0123669 15.9964C0.0100885 15.7342 0.110883 15.4816 0.293041 15.293Z" fill="#526EFF" />
                                </svg>
                            </button>
                        </div>
                        <div className={styles.calculationForm__wrapper}>
                            <div className={styles.calculationForm__inputWrapper}>
                                <label className={styles.calculationForm__label} htmlFor="length">Длина м </label>
                                <input
                                    className={styles.calculationForm__input}
                                    id="length"
                                    type="number"
                                    {...register('length', { required: 'Введите длину' })}
                                    placeholder="6.5"></input>
                                {errors.length && (
                                    <p className={styles.errorMessage} style={{ color: "red", margin: 0 }}>{(errors.length as { message: string }).message}</p>
                                )}
                            </div>
                            <div className={styles.calculationForm__inputWrapper}>
                                <label className={styles.calculationForm__label} htmlFor="width">Ширина м </label>
                                <input
                                    className={styles.calculationForm__input}
                                    id="width"
                                    type="number"
                                    {...register('width', { required: 'Введите ширину' })}
                                    placeholder="6.5"></input>
                                {errors.width && (
                                    <p className={styles.errorMessage} style={{ color: "red", margin: 0 }}>{(errors.width as { message: string }).message}</p>
                                )}
                            </div>
                            <div className={styles.calculationForm__inputWrapper}>
                                <label className={styles.calculationForm__label} htmlFor="height">Высота м </label>
                                <input
                                    className={styles.calculationForm__input}
                                    id="height"
                                    type="number"
                                    {...register('height', { required: 'Введите высоту' })}
                                    placeholder="6.5"></input>
                                {errors.height && (
                                    <p className={styles.errorMessage} style={{ color: "red", margin: 0 }}>{(errors.height as { message: string }).message}</p>
                                )}
                            </div>
                        </div>
                    </fieldset>
                    <div className={styles.calculationForm__flexWrapper}>
                        <fieldset className={styles.calculationForm__groupRoll}>
                            <legend className={styles.calculationForm__groupName}>Параметры рулона</legend>
                            <div className={styles.calculationForm__rollParametrs}>
                                <button className={`${styles.calculationForm__rollButtonNormal} btn ${parametrsRoll === "normal" ? styles.active : ""}`} onClick={() => handleButtonClick("normal")} formNoValidate type="button">1.06 x 10м</button>
                                <button className={`${styles.calculationForm__rollButtonBig} btn ${parametrsRoll === "big" ? styles.active : ""}`} onClick={() => handleButtonClick("big")} formNoValidate type="button">1.06 x 25м</button>
                            </div>
                        </fieldset>
                        <fieldset className={styles.calculationForm__group}>
                            <legend className={styles.calculationForm__groupName}>Раппорт</legend>
                            <div className={styles.calculationForm__rollParametrs}>
                                <button className={`${styles.calculationForm__rollButtonRapportSmall} btn ${rapport === "small" ? styles.active : ""}`}
                                    onClick={() => handleButtonRapportClick("small")}
                                    formNoValidate
                                    type="button">0</button>
                                <button className={`${styles.calculationForm__rollButtonRapportNormal} btn ${rapport === "normal" ? styles.active : ""}`}
                                    onClick={() => handleButtonRapportClick("normal")}
                                    formNoValidate
                                    type="button">0.32м</button>
                                <button className={`${styles.calculationForm__rollButtonRapportBig} btn ${rapport === "big" ? styles.active : ""}`}
                                    onClick={() => handleButtonRapportClick("big")}
                                    formNoValidate
                                    type="button">0.64м</button>
                            </div>
                        </fieldset>
                    </div>
                    <h2 className={styles.calculationForm__groupName}>Параметры окон</h2>
                    <ul className={styles.calculationForm__list}>
                        {addWindow.map((item) => (
                            <li className={styles.calculationForm__item} key={item.id}>
                                <div className={styles.calculationForm__windowGroup}>
                                    <h3 className={styles.calculationForm__windowName}>Окно</h3>
                                    <button className={styles.calculationForm__windowButtonCross} onClick={() => removeWindowHandler(item.id)}>
                                        <svg className={styles.calculationForm__windowIconCross} width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.293041 15.293L6.58604 9L0.293041 2.707C0.110883 2.5184 0.0100885 2.2658 0.0123669 2.0036C0.0146453 1.74141 0.119815 1.49059 0.305223 1.30519C0.490631 1.11978 0.741443 1.01461 1.00364 1.01233C1.26584 1.01005 1.51844 1.11085 1.70704 1.29301L8.00004 7.58601L14.293 1.29301C14.3853 1.19749 14.4956 1.12131 14.6176 1.0689C14.7396 1.01649 14.8709 0.988908 15.0036 0.987754C15.1364 0.986601 15.2681 1.0119 15.391 1.06218C15.5139 1.11246 15.6255 1.18672 15.7194 1.28061C15.8133 1.3745 15.8876 1.48615 15.9379 1.60905C15.9881 1.73195 16.0134 1.86363 16.0123 1.99641C16.0111 2.12919 15.9836 2.26041 15.9311 2.38241C15.8787 2.50441 15.8026 2.61476 15.707 2.707L9.41404 9L15.707 15.293C15.8026 15.3853 15.8787 15.4956 15.9311 15.6176C15.9836 15.7396 16.0111 15.8708 16.0123 16.0036C16.0134 16.1364 15.9881 16.2681 15.9379 16.391C15.8876 16.5139 15.8133 16.6255 15.7194 16.7194C15.6255 16.8133 15.5139 16.8875 15.391 16.9378C15.2681 16.9881 15.1364 17.0134 15.0036 17.0123C14.8709 17.0111 14.7396 16.9835 14.6176 16.9311C14.4956 16.8787 14.3853 16.8025 14.293 16.707L8.00004 10.414L1.70704 16.707C1.51844 16.8892 1.26584 16.99 1.00364 16.9877C0.741443 16.9854 0.490631 16.8802 0.305223 16.6948C0.119815 16.5094 0.0146453 16.2586 0.0123669 15.9964C0.0100885 15.7342 0.110883 15.4816 0.293041 15.293Z" fill="#526EFF" />
                                        </svg>
                                    </button>
                                </div>
                                <div className={styles.calculationForm__windowData}>
                                    <div className={styles.calculationForm__inputWrapper}>
                                        <label className={styles.calculationForm__label} htmlFor="height">Высота м </label>
                                        <input
                                            className={styles.calculationForm__windowInput}
                                            id="height"
                                            type="number"
                                            name="height"
                                            required
                                            value={item.height === 0 ? "" : item.height}
                                            onChange={(event) => handleWindowHeightChange(item.id, event)}
                                            placeholder="0"></input>
                                    </div>
                                    <div className={styles.calculationForm__inputWrapper}>
                                        <label className={styles.calculationForm__label} htmlFor="width">Ширина м </label>
                                        <input
                                            className={styles.calculationForm__windowInput}
                                            id="width"
                                            type="number"
                                            name="width"
                                            required
                                            value={item.width === 0 ? "" : item.width}
                                            onChange={(event) => handleWindowWidthChange(item.id, event)}
                                            placeholder="0"></input>
                                    </div>
                                </div>
                            </li>
                        ))}
                        <li className={styles.calculationForm__addItem}>
                            <button className={styles.calculationForm__addButton} onClick={addWindowHandler} formNoValidate>
                                <span className={styles.calculationForm__space}>
                                    <svg className={styles.calculationForm__iconSheet} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 3V1C6 0.734784 6.10536 0.48043 6.29289 0.292893C6.48043 0.105357 6.73478 0 7 0C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.48043 8 0.734784 8 1V3C8 3.26522 7.89464 3.51957 7.70711 3.70711C7.51957 3.89464 7.26522 4 7 4C6.73478 4 6.48043 3.89464 6.29289 3.70711C6.10536 3.51957 6 3.26522 6 3ZM1 8H3C3.26522 8 3.51957 7.89464 3.70711 7.70711C3.89464 7.51957 4 7.26522 4 7C4 6.73478 3.89464 6.48043 3.70711 6.29289C3.51957 6.10536 3.26522 6 3 6H1C0.734784 6 0.48043 6.10536 0.292893 6.29289C0.105357 6.48043 0 6.73478 0 7C0 7.26522 0.105357 7.51957 0.292893 7.70711C0.48043 7.89464 0.734784 8 1 8ZM22 12V21C22 21.2652 21.8946 21.5196 21.7071 21.7071C21.5196 21.8946 21.2652 22 21 22H7C6.73478 22 6.48043 21.8946 6.29289 21.7071C6.10536 21.5196 6 21.2652 6 21V7C6 6.73478 6.10536 6.48043 6.29289 6.29289C6.48043 6.10536 6.73478 6 7 6H16C16.2626 6.01246 16.5126 6.11607 16.707 6.293L21.707 11.293C21.887 11.4855 21.9911 11.7366 22 12ZM20 13H16C15.7348 13 15.4804 12.8946 15.2929 12.7071C15.1054 12.5196 15 12.2652 15 12V8H8V20H20V13Z" fill="white" />
                                    </svg>
                                </span>
                                <span className={styles.calculationForm__add}>Добавить окно</span>
                            </button>
                        </li>
                    </ul>
                    <h2 className={styles.calculationForm__groupName}>Параметры дверей</h2>
                    <ul className={styles.calculationForm__list}>
                        {addDoor.map((item) => (
                            <li className={styles.calculationForm__item} key={item.id}>
                                <div className={styles.calculationForm__windowGroup}>
                                    <h3 className={styles.calculationForm__windowName}>Дверь</h3>
                                    <button className={styles.calculationForm__windowButtonCross} onClick={() => removeDoorHandler(item.id)}>
                                        <svg className={styles.calculationForm__windowIconCross} width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.293041 15.293L6.58604 9L0.293041 2.707C0.110883 2.5184 0.0100885 2.2658 0.0123669 2.0036C0.0146453 1.74141 0.119815 1.49059 0.305223 1.30519C0.490631 1.11978 0.741443 1.01461 1.00364 1.01233C1.26584 1.01005 1.51844 1.11085 1.70704 1.29301L8.00004 7.58601L14.293 1.29301C14.3853 1.19749 14.4956 1.12131 14.6176 1.0689C14.7396 1.01649 14.8709 0.988908 15.0036 0.987754C15.1364 0.986601 15.2681 1.0119 15.391 1.06218C15.5139 1.11246 15.6255 1.18672 15.7194 1.28061C15.8133 1.3745 15.8876 1.48615 15.9379 1.60905C15.9881 1.73195 16.0134 1.86363 16.0123 1.99641C16.0111 2.12919 15.9836 2.26041 15.9311 2.38241C15.8787 2.50441 15.8026 2.61476 15.707 2.707L9.41404 9L15.707 15.293C15.8026 15.3853 15.8787 15.4956 15.9311 15.6176C15.9836 15.7396 16.0111 15.8708 16.0123 16.0036C16.0134 16.1364 15.9881 16.2681 15.9379 16.391C15.8876 16.5139 15.8133 16.6255 15.7194 16.7194C15.6255 16.8133 15.5139 16.8875 15.391 16.9378C15.2681 16.9881 15.1364 17.0134 15.0036 17.0123C14.8709 17.0111 14.7396 16.9835 14.6176 16.9311C14.4956 16.8787 14.3853 16.8025 14.293 16.707L8.00004 10.414L1.70704 16.707C1.51844 16.8892 1.26584 16.99 1.00364 16.9877C0.741443 16.9854 0.490631 16.8802 0.305223 16.6948C0.119815 16.5094 0.0146453 16.2586 0.0123669 15.9964C0.0100885 15.7342 0.110883 15.4816 0.293041 15.293Z" fill="#526EFF" />
                                        </svg>
                                    </button>
                                </div>
                                <div className={styles.calculationForm__windowData}>
                                    <div className={styles.calculationForm__inputWrapper}>
                                        <label className={styles.calculationForm__label} htmlFor="height">Высота м </label>
                                        <input
                                            className={styles.calculationForm__windowInput}
                                            id="height"
                                            type="number"
                                            name="height"
                                            required
                                            value={item.height === 0 ? "" : item.height}
                                            onChange={(event) => handleDoorHeightChange(item.id, event)}
                                            placeholder="0"></input>
                                    </div>
                                    <div className={styles.calculationForm__inputWrapper}>
                                        <label className={styles.calculationForm__label} htmlFor="width">Ширина м </label>
                                        <input
                                            className={styles.calculationForm__windowInput}
                                            id="width"
                                            type="number"
                                            name="width"
                                            required
                                            value={item.width === 0 ? "" : item.width}
                                            onChange={(event) => handleDoorWidthChange(item.id, event)}
                                            placeholder="0"></input>
                                    </div>
                                </div>
                            </li>
                        ))}
                        <li className={styles.calculationForm__addItem}>
                            <button className={styles.calculationForm__addButton} onClick={addDoorHandler}>
                                <span className={styles.calculationForm__space}>
                                    <svg className={styles.calculationForm__iconSheet} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 3V1C6 0.734784 6.10536 0.48043 6.29289 0.292893C6.48043 0.105357 6.73478 0 7 0C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.48043 8 0.734784 8 1V3C8 3.26522 7.89464 3.51957 7.70711 3.70711C7.51957 3.89464 7.26522 4 7 4C6.73478 4 6.48043 3.89464 6.29289 3.70711C6.10536 3.51957 6 3.26522 6 3ZM1 8H3C3.26522 8 3.51957 7.89464 3.70711 7.70711C3.89464 7.51957 4 7.26522 4 7C4 6.73478 3.89464 6.48043 3.70711 6.29289C3.51957 6.10536 3.26522 6 3 6H1C0.734784 6 0.48043 6.10536 0.292893 6.29289C0.105357 6.48043 0 6.73478 0 7C0 7.26522 0.105357 7.51957 0.292893 7.70711C0.48043 7.89464 0.734784 8 1 8ZM22 12V21C22 21.2652 21.8946 21.5196 21.7071 21.7071C21.5196 21.8946 21.2652 22 21 22H7C6.73478 22 6.48043 21.8946 6.29289 21.7071C6.10536 21.5196 6 21.2652 6 21V7C6 6.73478 6.10536 6.48043 6.29289 6.29289C6.48043 6.10536 6.73478 6 7 6H16C16.2626 6.01246 16.5126 6.11607 16.707 6.293L21.707 11.293C21.887 11.4855 21.9911 11.7366 22 12ZM20 13H16C15.7348 13 15.4804 12.8946 15.2929 12.7071C15.1054 12.5196 15 12.2652 15 12V8H8V20H20V13Z" fill="white" />
                                    </svg>
                                </span>
                                <span className={styles.calculationForm__add}>Добавить дверь</span>
                            </button>
                        </li>
                    </ul>
                    {openСalculation &&
                        <button className={`${styles.calculationForm__button} btn`} type="submit">
                            <svg className={styles.calculationForm__icon} width='22' height='22'>
                                <use xlinkHref='/sprite.svg#icon'></use>
                            </svg>
                            <span className={styles.calculationForm__buttonText}>Рассчитать кол-во материалов</span>
                            <span className={styles.calculationForm__buttonAdaptiveText}>Рассчитать материалы</span>
                        </button>
                    }

                    {openResult &&
                        <div className={styles.calculationForm__result}>
                            <h2 className={styles.calculationForm__resultTitle}>Результаты</h2>
                            <div className={styles.calculationForm__resultWrapper}>
                                <div className={styles.calculationForm__resultData}>
                                    <span className={styles.calculationForm__resultNumber}>{rollsNeeded}</span>
                                    <span className={styles.calculationForm__resultText}>Кол-во рулонов</span>
                                </div>
                                <div className={styles.calculationForm__resultData}>
                                    <span className={styles.calculationForm__resultNumber}>{wallpaperArea.toFixed(1)} м2</span>
                                    <span className={styles.calculationForm__resultText}>Кол-во m2 обоев</span>
                                </div>
                                <div className={styles.calculationForm__resultData}>
                                    <span className={styles.calculationForm__resultNumber}>{wallArea} м2</span>
                                    <span className={styles.calculationForm__resultText}>Площадь оклейки</span>
                                </div>
                            </div>
                            <div className={styles.calculationForm__resultButtonWrapper}>
                                <button className={styles.calculationForm__resultButtonReset} type="button" onClick={handleReset}>Сбросить параметры</button>
                                <button className={styles.calculationForm__resultButton} type="button">Перейти в каталог</button>
                            </div>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default Calculation