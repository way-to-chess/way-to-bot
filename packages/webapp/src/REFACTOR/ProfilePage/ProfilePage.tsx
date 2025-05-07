import classes from "./ProfilePage.module.css";
import { ImgWithContainer } from "../ImgWithContainer/ImgWithContainer";
import { Typography } from "../Typography/Typography";
import { Input } from "@base-ui-components/react";
import { Button } from "../../Button/Button";

const ProfilePage = () => {
  return (
    <div className={classes.page}>
      <div className={classes.preview}>
        <ImgWithContainer className={classes.imgContainer} />
        <label className={classes.fileInput}>
          Выбрать фото
          <input type={"file"} />
        </label>
        <Typography type={"title5"} />
      </div>
      <Input placeholder={"Имя"} className={classes.input} />
      <Input placeholder={"Фамилия"} className={classes.input} />
      <Button disabled className={classes.button}>
        {"Создать профиль"}
      </Button>
    </div>
  );
};

export { ProfilePage };
