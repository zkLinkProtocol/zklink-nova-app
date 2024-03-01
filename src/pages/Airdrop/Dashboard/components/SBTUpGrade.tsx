import { Button, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import styled from 'styled-components'

const SBTBox = styled.div`
    & {
        margin: 0 auto;
        width: 320px;
        height: 320px;
        background: #fff;

        .sbt-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #000;
        }

        .upgrade-btn {
            position: absolute;
            bottom: 20px;
            left: 50%;
            background: rgba(0, 0, 0, 0.5);
            transform: translate(-50%, 0);
        }
    }
`
export default function SBTUpGrade() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <>
            <SBTBox className='relative'>
                <span className='sbt-text text-3xl'>SBT</span>
                <Button
                    className='upgrade-btn text-base w-9/12'
                    onPress={onOpen}>
                    UpGrade
                </Button>
            </SBTBox>

            <Modal
                size='2xl'
                isOpen={isOpen}
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className='flex flex-col gap-1'>Upgrade your Nova Char</ModalHeader>
                            <ModalBody>
                                <div className='flex items-center justify-between'>
                                    <div className='flex flex-wrap w-40'>
                                        {new Array(4).fill('').map((_, index) => (
                                            <div
                                                className='flex justify-center items-center my-2 mx-2 w-16 h-16 bg-white text-black text-base'
                                                key={index}>
                                                piece1
                                            </div>
                                        ))}
                                    </div>
                                    <div className='text-xl mx-4'>+</div>
                                    <div className='flex justify-center mx-2 w-36 h-36 items-center bg-white  text-black text-xl text-center'>
                                        SBT
                                    </div>
                                    <div className='text-xl mx-4 mt-4'>=</div>
                                    <div className='flex justify-center mx-2 w-36 h-36 items-center bg-white  text-black text-xl text-center'>
                                        <div>
                                            <div>Upgraded</div>
                                            <div>SBT</div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className='w-full'
                                    color='success'
                                    onPress={onClose}>
                                    UpGrade
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
