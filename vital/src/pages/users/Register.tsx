import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import axios from 'axios';
import { getCroppedImg } from '../../utils/cropImage';
import { useNavigate } from "react-router-dom";


export default function Register() {
    const [form, setForm] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null);
    const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [flip, setFlip] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropper, setShowCropper] = useState(false);
    const navigate = useNavigate();

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setShowCropper(true);
            };
        }
    };

    // @ts-ignore
    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const confirmCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            // @ts-ignore
            const { blob, previewUrl } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, flip);
            setCroppedImageBlob(blob);
            setCroppedImageURL(previewUrl);
            setShowCropper(false);
        } catch (e) {
            console.error('Crop failed:', e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (croppedImageBlob) {
            formData.append('image', croppedImageBlob, 'avatar.jpg');
        }
        try {
            await axios.post('http://127.0.0.1:4099/api/register/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Registration successful!');
            navigate("/");
        } catch (err) {
            console.error(err);
            alert('Registration failed');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">User Registration</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {['username', 'first_name', 'last_name', 'email', 'password'].map((field) => (
                    <input
                        key={field}
                        type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                        name={field}
                        placeholder={field.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                        required
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                ))}

                <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                />

                {/* Cropper */}
                {showCropper && imageSrc && (
                    <div className="mt-4 p-4 border border-gray-300 rounded bg-white relative">
                        <h3 className="text-lg font-semibold mb-2">Edit Image</h3>
                        <div className="relative w-full h-[300px] bg-gray-100 rounded overflow-hidden">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                rotation={rotation}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="mt-3 space-y-3">
                            <div>
                                <label className="text-sm">Zoom</label>
                                <Slider
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(_, value) => setZoom(value as number)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRotation((r) => r - 90)}
                                    className="bg-gray-200 px-3 py-1 rounded"
                                >
                                    Rotate Left
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRotation((r) => r + 90)}
                                    className="bg-gray-200 px-3 py-1 rounded"
                                >
                                    Rotate Right
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFlip((f) => !f)}
                                    className="bg-gray-200 px-3 py-1 rounded"
                                >
                                    Flip Horizontal
                                </button>
                            </div>

                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={confirmCrop}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    ✅ Confirm Crop
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {croppedImageURL && (
                    <div className="mt-4">
                        <p className="mb-1 text-sm text-gray-600">Cropped Image Preview:</p>
                        <img
                            src={croppedImageURL}
                            alt="Cropped Preview"
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
