import React from "react";
import axios from "axios";
import { Container, Table, Button } from "semantic-ui-react";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";

import { useParams } from "react-router-dom";
import { Gender } from '../types'

import { updatePatient } from '../state/reducer'

const PatientListPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();

  const { id } = useParams<{ id: string }>();
  const patient = () => patients[id];

  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientData = async () => {
      console.log(patients);
      if (id in patients && !patients[id].ssn) {
        try {
          const { data: patientData } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(updatePatient(patientData));
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchPatientData();
  }, [dispatch, patients]);


  const genderIcon = (gender: Gender) => {
    if (gender === 'female') {
      return (
        <i className="venus icon"></i>
      )
    } else if (gender === 'male') {
      return (
        <i className="mars icon"></i>
      )
    }
    return (
      <i className="transgender alternate icon"></i>
    )
  }

  if (patient()) {
    return (
      <div className="App">
        <h3>{patient().name} {genderIcon(patient().gender)}</h3>
        <div>
          <p>ssn: {patient().ssn}</p>
          <p>ocuupation: {patient().occupation}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App"></div>
    )
  }

};

export default PatientListPage;
