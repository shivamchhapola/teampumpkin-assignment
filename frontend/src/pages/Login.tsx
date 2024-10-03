import axios from 'axios';
import Logowithtext from '../assets/logowithtext.png';
import ButtonSolid from '../components/ButtonSolid';
import TextInput from '../components/TextInput';
import { BackendUrl } from '../config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  const login = async () => {
    if (!email || !password) return;
    setErrorText('');
    if (password.length < 8)
      return setErrorText('Password must be at least 8 characters');
    await axios
      .post(`${BackendUrl}/user/login`, { email, password })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userid', res.data.userId);
          navigate('/trips');
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorText('Invalid password!');
      });
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[rgba(175,220,177,1)] to-[rgba(130,196,218,1)] flex justify-center items-center p-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        className="max-w-[40rem] w-full flex flex-col gap-6 bg-white rounded-2xl px-3 justify-center items-center md:py-[7rem] py-14">
        <div className="h-[3.5rem]">
          <img src={Logowithtext} alt="Logo" className="h-full" />
        </div>
        <TextInput
          name="Email"
          placeholder="example@email.com"
          width="24rem"
          setItem={setEmail}
          value={email}
          autocomplete="email"
        />
        <TextInput
          name="Password"
          placeholder="At least 8 characters"
          width="24rem"
          setItem={setPassword}
          value={password}
          type="password"
          autocomplete="current-password"
        />
        <div className="text-red-400 text-center text-sm">{errorText}</div>
        <ButtonSolid onClick={login} text="Sign in" width="24rem" />
      </form>
    </div>
  );
};

export default Login;
