import { ReactNode } from 'react';
import Styles from '../components/GlobalStyle.module.scss';

interface aboutuscomp{
title: string;
describe: string;
icon: ReactNode;
};
export default function AboutUSComp({title, describe, icon} : aboutuscomp){
    return(
        <div className={Styles.AboutUsCard}>
        <div>
            <span>{icon}</span>
            <h1>{title}</h1>
            <p>{describe}</p>

        </div>
        </div>
       

    );

}