const main = () => {
    const getTgIdPromise = new Promise<string | number | null>((resolve) => {
        const tgIdFromStorage = localStorage.getItem("tgId")

        if (tgIdFromStorage) {
            return resolve(tgIdFromStorage)
        }

        const tgId = window.prompt("Пароль");

        resolve(tgId);
    })

    getTgIdPromise.then((value) => {
        if (!value) {
            main();
        }

        const root = document.getElementById("root")

        if (root) {
            root.innerText = "Загрузка..."
        }

        fetch(import.meta.env.VITE_API_URL + "/auth/tg", {
            method: "POST",
            body: JSON.stringify({tgId: value}),
        }).then((response) => {
            if (response.ok) {
                localStorage.setItem("tgId", String(value));

                import("./App")
            } else {
                localStorage.removeItem("tgId",);
                main()
            }
        }).catch((err) => {
            document.body.innerText = err
        })
    })
}

main()

