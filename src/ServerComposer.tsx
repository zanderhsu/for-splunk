
import { InputType, cpuOptions, ServerModel,getServerModelOptions, CPU, isMultipleOf1024, isPowerOf2} from './serverModels';
import { Form, Select, Checkbox, Flex,Typography, Button, Divider, List,InputNumber  } from 'antd';
import { useState } from 'react';

const {Title} = Typography;

const itemStyle = {width: "32%"}

function ServerComposer() {
  const [form] = Form.useForm();
  const [serverModels, setServerModels] = useState<ServerModel[]>([]);

  const onFinish = async (input:InputType)=>{
    const options = getServerModelOptions(input)
    setServerModels(options)
  }

  return (
    <Flex  vertical justify='flex-start' style={{marginTop:20,marginLeft:50,width:'50%'}}>
    <Form 
        initialValues={{cpu:CPU.X86, memSize:2048, needsGPU:false}}
        layout="vertical" 
        form={form}
        style={{width:'100%'}}
        onFinish={onFinish}
    >
      <Title level={2}>Server Composer</Title>
      <Flex gap="large" align='flex-start'>
        <Form.Item style={itemStyle} label="CPU" name="cpu"
          rules={[{ required: true, message: 'CPU is required' }]}
        >
          <Select data-testid="cpu" size="small" options={cpuOptions.map(o=>({label:o,value:o}))}/>
        </Form.Item>
        
        <Form.Item 
          style={{...itemStyle}} 
          label="Memory Size" 
          name="memSize"
          rules={[
            { required: true, message: 'Memory Size is required' },
            { validator: (_,value)=>{
                
                if(value < 2048 || value > 8388608){
                  return Promise.reject(new Error('Memory Size must be between 4,096 and 8,388,608 MB'))
                }
                if(!isMultipleOf1024(value)){
                  return Promise.reject(new Error('Memory Size must be multiple of 1024 MB'))
                }

                if(!isPowerOf2(value)){
                  return Promise.reject(new Error('Memory Size must be power of 2'))
                }
                return Promise.resolve()
              }
            }
            ]}
          >
          <InputNumber 
            data-testid="mem-size" 
            // step={1024} 
            // min={2048} 
            // max={8388608} 
            style={{width:'100%',textAlignLast:'center'}}
            size="small" 
            addonAfter="MB" 
            formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')??""} 
            parser={(value:string|undefined) => parseInt( value?.replace(/,/g, '')??'2048')} 
          />
        </Form.Item>
        <Form.Item label={' '}  style={itemStyle} name="needsGPU" valuePropName='checked'>
          <Checkbox data-testid="needs-gpu" >GPU Accelerateor Card</Checkbox>
        </Form.Item>
        
      </Flex>
      <Form.Item><Button data-testid="submit-button" type="default" style={{backgroundColor:'lightgrey'}} htmlType="submit">Submit</Button></Form.Item>
    </Form>
    <Divider style={{borderWidth:'3px', margin:0}}/>
    <Title level={2}>{serverModels.length?"Server Model Options":"No Options"}</Title>
    <List 
        locale={{ emptyText: true }} 
        style={{marginLeft:40}}
        split={false}
        dataSource={serverModels}
        renderItem={(item)=><List.Item >•&nbsp;<span data-testid="server-model-item">{item}</span ></List.Item>}
      />
      
    </Flex>
  );
}

export default ServerComposer;
