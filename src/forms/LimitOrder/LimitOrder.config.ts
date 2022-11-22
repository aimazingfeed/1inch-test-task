import Web3 from 'web3';
import * as Yup from 'yup';

export const initialValues = {
  makerAssetAddress: '',
  takerAssetAddress: '',
  makerAmount: '',
  takerAmount: '',
};

export const poolValidationSchema = () => {
  return Yup.object().shape({
    makerAssetAddress: Yup.string()
      .required('Field cannot be empty')
      .test('web3-address', 'Not a blockchain address', (value) => Web3.utils.isAddress(value)),
    takerAssetAddress: Yup.string()
      .required('Field cannot be empty')
      .test('web3-address', 'Not a blockchain address', (value) => Web3.utils.isAddress(value)),
    makerAmount: Yup.number().moreThan(0, 'Field must be greater than zero').required('Field cannot be empty'),
    takerAmount: Yup.number().moreThan(0, 'Field must be greater than zero').required('Field cannot be empty'),
  });
};
