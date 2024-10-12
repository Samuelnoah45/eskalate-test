import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Button, Container, Flex, Text } from '@mantine/core';
import React from 'react';
import { useUpdateDeveloperMutation } from '@/lib/redux/api/developer/developer';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
import { useModals } from '@/Providers/ModalContext';

export default function OverviewForm({
    close,
    overviewValue
}: {
    close: () => void;
    overviewValue: string;
}) {
    const [updateDeveloper, { isLoading, isError, isSuccess }] =
        useUpdateDeveloperMutation();

    const [content, setContent] = React.useState<string>(overviewValue);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color
        ],
        content: content,
        onUpdate: ({ editor }: { editor: any }) => {
            if (editor.getHTML().length <= 1000) {
                setContent(editor.getHTML());
            } else {
                editor.commands.setContent(content);
            }
        }
    });

    const handleSave = () => {
        const newValue = {
            profileOverview: content
        };

        updateDeveloper(newValue)
            .unwrap()
            .then((data: any) => {
                close();
                toast.success('Profile Overview updated successfully');
            })
            .catch((error: any) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    return (
        <Container
            style={{
                overflow: 'hidden'
            }}
            p={0}
            m={0}
        >
            <RichTextEditor
                editor={editor}
                h={'300px'}
                style={{
                    overflowY: 'scroll',
                    scrollbarWidth: 'thin'
                }}
            >
                <RichTextEditor.Toolbar sticky>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.ClearFormatting />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
            </RichTextEditor>

            {/* maximum number of characters */}
            <Text mt={5}>
                {editor?.getText().length} /{1000} character
            </Text>
            <Text mt={5} c={'red'}>
                {content.length >= 1000 &&
                    "You've reached the maximum number of characters"}
            </Text>

            {/*</Container>*/}
            <Flex justify="flex-end" mt={24} gap={24}>
                <Button disabled={isLoading} variant="default" onClick={close}>
                    Cancel
                </Button>
                <Button onClick={handleSave} loading={isLoading}>
                    Save
                </Button>
            </Flex>
        </Container>
    );
}
