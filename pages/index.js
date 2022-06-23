import { IMaskInput } from 'react-imask';
import {
  FormControl,
  InputLabel,
  Input,
  OutlinedInput,
  TextField,
  Box,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import { useState, forwardRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

// -------------------------- Input Masks ---------------------------------
const CardMaskCustom = forwardRef(function CardMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask='0000 0000 0000 0000'
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const CVVMaskCustom = forwardRef(function CVVMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask='000'
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});
// -------------------------- Input Masks ---------------------------------

export default function Home() {
  const paymentBlueprint = () => {
    return {
      cardnumber: '0000 0000 0000 0000',
      cvv: '000',
      amount: 0,
      month: '01',
      year: '2022',
    };
  };
  const [payment, setPayment] = useState({
    cardnumber: '0000 0000 0000 0000',
    cvv: '000',
    amount: 0,
    month: '01',
    year: '2022',
  });
  const [disabled, setDisabled] = useState(true);

  // Handlers -------------------------------------------------------------
  const handleChange = (event) => {
    setPayment({
      ...payment,
      [event.target.name]: event.target.value,
    });
  };

  const handleRequest = async () => {
    const res = await axios('/api/payment', {
      method: 'post',
      data: {
        cardnumber: payment.cardnumber.replace(/\s/g, ''),
        expDate: payment.month + '/' + payment.year,
        cvv: payment.cvv,
        amount: Number(payment.amount),
      },
    });
    if (res.status === 200) {
      setPayment(paymentBlueprint());
    }
  };
  // Basic validation ------------------------------------------------------
  useEffect(() => {
    if (
      payment.cardnumber === '0000 0000 0000 0000' ||
      payment.cardnumber === '' ||
      payment.cardnumber.length !== 19 ||
      payment.year < new Date().getFullYear() ||
      (Number(payment.year) === new Date().getFullYear() &&
        Number(payment.month) < new Date().getMonth()) ||
      payment.cvv === '000' ||
      payment.cardnumber === '' ||
      payment.amount === 0 ||
      payment.amount === null
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [payment]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Datasub payment</title>
        <meta name='description' content='Datasub payment' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Box
        className={styles.payment__container}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '50%',
          gap: '30px',
          border: '1px solid black',
          padding: '30px',
          paddingTop: '50px',
        }}
      >
        {/* ----------------------------- Payment form markup ----------------------- */}
        {/* ----------------------------- Card Number ------------------------------- */}
        <FormControl fullWidth variant='standard' sx={{ width: '100%' }}>
          <InputLabel htmlFor='formatted-card-mask-input' sx={{ top: '-20px' }}>
            Card number
          </InputLabel>
          <OutlinedInput
            className={styles.shadow}
            value={payment.cardnumber}
            onChange={handleChange}
            name='cardnumber'
            id='formatted-card-mask-input'
            inputComponent={CardMaskCustom}
            autoFocus={true}
            required
            error={payment.cardnumber === '0000 0000 0000 0000' ? true : false}
          />
        </FormControl>
        <Box sx={{ display: 'flex', width: '100%', gap: '20px' }}>
          {/* -------------------------------- Month and Year --------------------------- */}
          <FormControl fullWidth>
            {/* ------------------------------ Month ------------------------------- */}
            <InputLabel id='month-select-label'>Month</InputLabel>
            <Select
              labelId='month-select-label'
              id='month-select'
              value={payment.month}
              label='month'
              name='month'
              onChange={handleChange}
            >
              {months.map((el) => {
                return (
                  <MenuItem value={el} key={el}>
                    {el}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            {/* ------------------------------- Year --------------------------------- */}
            <InputLabel id='year-select-label'>Year</InputLabel>
            <Select
              labelId='year-select-label'
              id='year-select'
              value={payment.year}
              label='year'
              name='year'
              onChange={handleChange}
            >
              {years.map((el) => {
                return (
                  <MenuItem value={el} key={el}>
                    {el}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <FormControl variant='standard' sx={{ width: '100%' }}>
          {/* ------------------------------- CVV ------------------------------- */}
          <InputLabel htmlFor='cvv' sx={{ top: '-20px' }}>
            CVV
          </InputLabel>
          <OutlinedInput
            className={styles.shadow}
            value={payment.cvv}
            onChange={handleChange}
            name='cvv'
            id='formatted-cvv-mask-input'
            inputComponent={CVVMaskCustom}
            type='password'
            required
            error={payment.cvv === '000' ? true : false}
          />
        </FormControl>
        <FormControl variant='standard' sx={{ width: '100%' }}>
          {/* ------------------------------- Amount ------------------------------ */}
          <InputLabel
            htmlFor='formatted-amount-mask-input'
            sx={{ top: '-20px' }}
          >
            Amount
          </InputLabel>
          <OutlinedInput
            className={styles.shadow}
            value={payment.amount}
            onChange={handleChange}
            name='amount'
            id='formatted-amount-mask-input'
            // inputComponent={CVVMaskCustom}
            type='number'
            error={payment.amount === 0 ? true : false}
          />
        </FormControl>
        <Button
          className={styles.button}
          onClick={handleRequest}
          disabled={disabled}
        >
          Pay
        </Button>
      </Box>
      {/* ----------------------------- Payment form markup ----------------------- */}
    </div>
  );
}

export const months = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];
export const years = [
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
  '2027',
  '2028',
  '2029',
  '2030',
  '2031',
  '2032',
  '2033',
  '2034',
  '2035',
  '2036',
  '2037',
  '2038',
  '2039',
  '2040',
];
