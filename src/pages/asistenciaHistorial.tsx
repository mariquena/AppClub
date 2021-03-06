﻿import {
    IonPage,
    IonLabel,
    IonContent,
    IonButton,
    IonItem,
    IonHeader,
    IonList,
    IonModal,
    IonToast
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { iAsistItem, iAsistencia } from '../interfaces';
import BD from '../BD';

interface UserDetailPageProps extends RouteComponentProps<{
    id: string;
}> { }

let categoriaDB!: PouchDB.Database<{}>; 

const AsistenciaHist: React.FC<UserDetailPageProps> = ({ match }) => {

    const [showModal, setShowModal] = useState(false);
    const [fechas, setFechas] = useState<iAsistencia[]>([]);
    const [presentes, setPresentes] = useState<iAsistItem[]>([]);
    const [toast, setToast] = useState(false);

    const cat = match.params.id;
    let titulo = "";

    switch (cat) {
        case "1": categoriaDB = BD.getCat1fDB()
            titulo = "1° División femenina"                  
            break;
        case "2": categoriaDB = BD.getCat1mDB();
            titulo = "1° División masculina"
            break;
        case "3": categoriaDB = BD.getCat5DB();
            titulo = "5° División"
            break;
        case "4": categoriaDB = BD.getCat7DB();
            titulo = "7° División mixta"
            break;
        case "5": categoriaDB = BD.getCat9DB();
            titulo = "9° División mixta"
            break;
        case "6": categoriaDB = BD.getCat11DB();
            titulo = "11° División mixta"
            break;
        case "7": categoriaDB = BD.getCat13DB();
            titulo = "13° División mixta"
            break;
        case "8": categoriaDB = BD.getCat15DB();
            titulo = "15° División mixta"
            break;
    }

    useEffect(() => {
        const docToAsistencia = (doc: any): iAsistencia => doc;
        let fechasBuscadas: iAsistencia[] = [];

        categoriaDB.allDocs({ include_docs: true })
            .then((resultado) => {
                fechasBuscadas = resultado.rows.map(row => docToAsistencia(row.doc));
                setFechas(fechasBuscadas);
            })
            .catch(res => { setToast(true)});
    }, []);

    const renderFechas = () => {
        return (
            fechas.map((fecha: iAsistencia) => (
                <IonItem key={fecha._id}>
                    <IonLabel>
                        <h2> <b>{fecha._id}</b></h2>
                    </IonLabel>
                    <IonButton fill="outline" size="small" slot="end" onClick={() => { setPresentes(fecha.presentes); setShowModal(true); } }>Ver presentes</IonButton>
                </IonItem>
            ))
        );
    }


    const renderJugadores = () => {
        return (
            presentes.map((jugador: iAsistItem) => (
                <IonItem key={jugador.dni}>
                    <IonLabel>
                        <h2>{jugador.nombre}</h2>
                    </IonLabel>
                    <IonLabel>
                        <h2>DNI: {jugador.dni}</h2>
                    </IonLabel>
                </IonItem>
            ))
        );
    }

    return (
        <IonPage>
            <IonToast
                isOpen={toast}
                onDidDismiss={() => setToast(false)}
                color={"danger"}
                message={"ERROR al buscar los historiales de asistencia pedidos"}
                duration={3500}
            />
            <IonContent>
                <IonModal isOpen={showModal}>
                    <IonList>
                        {renderJugadores()}
                    </IonList>
                </IonModal>
                <IonHeader>
                    <IonItem>
                        {titulo}
                    </IonItem>
                </IonHeader>
                <IonList>
                    {renderFechas()}
                </IonList>
            </IonContent>
        </IonPage>
    );
}
export default AsistenciaHist;
/*UTF8*/
