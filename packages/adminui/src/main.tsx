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
        console.log(value, 123)

        const root = document.getElementById("root")

        if (!value) {
            if (root) {
                root.innerText = "Не удалось получить пароль"
            }

            return
        }


        if (root) {
            root.innerText = "Загрузка..."
        }

        fetch(import.meta.env.VITE_API_URL + "/auth/tg", {
            method: "POST",
            body: JSON.stringify({tgId: Number(value)}),
            headers: {
                "content-type": "application/json"
            }
        }).then((response) => {
            if (response.ok) {
                localStorage.setItem("tgId", String(value));

                response.json().then((json) => {
                    localStorage.setItem("token", String(json.data.token));

                    import("./App")
                })

            } else {
                document.body.innerText = "Ошибка запроса или неверный пароль"
                localStorage.removeItem("tgId");
            }
        }).catch((err) => {
            localStorage.removeItem("tgId");
            document.body.innerText = err
        })
    })
}

main()

