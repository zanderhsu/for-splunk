
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CPU, cpuOptions, InputType, ServerModel } from './serverModels';
import {select} from 'ant-design-testing'
import ServerComposer from './ServerComposer';

function univeralTest(title:string, data:InputType, expectedResult:ServerModel[]){
  test(title,  async() => {
 
    const { container } = render(<ServerComposer />);
    
    /*
      antd Select is a bit special and I have to use 'ant-design-testing' to deal with it
    */
    select.fireOpen(container);
    select.fireSelect(document.body, cpuOptions.indexOf(data.cpu))

    const memSizeInput = screen.getByTestId('mem-size');
    fireEvent.click(memSizeInput);
    fireEvent.change(memSizeInput, {target:{value: data.memSize}});

    if (data.needsGPU ){
      const needsGPUCheckbox = screen.getByTestId('needs-gpu');
      fireEvent.click(needsGPUCheckbox);
    }
    
    const submitBUtton = screen.getByTestId('submit-button');
    fireEvent.click(submitBUtton);

    await waitFor(() => {
      const text = screen.queryByText('Server Model Options') || screen.queryByText('No Options');
      expect(text).toBeInTheDocument();
    });
    const listItems = screen.queryAllByTestId('server-model-item')
    const serverModelOptions = listItems.map((item)=>item.textContent)
    expect(serverModelOptions).toEqual(expect.arrayContaining(expectedResult));
    expect(expectedResult).toEqual(expect.arrayContaining(serverModelOptions));
  
  });
}

univeralTest(
  'Power | 1,024MB | No GPU',
  {cpu:CPU.Power, memSize:1024, needsGPU:false}, 
  []);

univeralTest(
    'Power | 4,097MB | No GPU',
    {cpu:CPU.Power, memSize:4097, needsGPU:false}, 
    []);
univeralTest(
      'Power | 3,072MB | No GPU',
      {cpu:CPU.Power, memSize:3072, needsGPU:false}, 
      []);

univeralTest(
  'Power | 262,144MB | No GPU',
  {cpu:CPU.Power, memSize:262144, needsGPU:false}, 
  [ServerModel.TowerServer, ServerModel._4URackServer, ServerModel.Mainframe]);

univeralTest(
    'X86 | 524,288MB | No GPU',
    {cpu:CPU.X86, memSize:524288, needsGPU:false}, 
    [ServerModel.TowerServer, ServerModel._4URackServer]);

univeralTest(
  'ARM | 524,288MB | with GPU',
  {cpu:CPU.ARM, memSize:524288, needsGPU:true}, 
  [ServerModel.HighDensityServer]);
