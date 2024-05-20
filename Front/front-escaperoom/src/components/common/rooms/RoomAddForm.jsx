import React, { useContext } from "react";
import { Formik, Form, Field } from "formik";
import AuthContext from "../../../contexts/AuthContext";

const RoomAddForm = ({ onSubmit }) => {
  const { user } = useContext(AuthContext);
  if (!user.isAdmin) {
    return null;
  }
  return (
    <Formik
      initialValues={{
        nazwa: "",
        miasto: "",
        trudność: "",
        tematyka: "",
        opis: "",
        pojemność: "",
        lat: "",
        lng: "",
        udogodnienia: "",
        zdjęcia: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="text" name="nazwa" placeholder="Nazwa" />
          <Field type="text" name="miasto" placeholder="Miasto" />
          <Field as="select" name="trudność">
            <option value="">Wybierz trudność</option>
            <option value="łatwy">Łatwy</option>
            <option value="średni">Średni</option>
            <option value="trudny">Trudny</option>
          </Field>
          <Field type="text" name="tematyka" placeholder="Tematyka" />
          <Field type="text" name="opis" placeholder="Opis" />
          <Field type="number" name="pojemność" placeholder="Pojemność" />
          <Field type="number" name="lat" placeholder="Latitude" />
          <Field type="number" name="lng" placeholder="Longitude" />
          <Field
            type="text"
            name="udogodnienia"
            placeholder="Udogodnienia (oddziel przecinkami)"
          />
          <Field
            type="text"
            name="zdjęcia"
            placeholder="Linki do zdjęć (oddziel przecinkami)"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="button button-gradient"
          >
            Zapisz
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RoomAddForm;
