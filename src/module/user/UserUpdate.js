import { Button } from 'components/button';
import { Radio } from 'components/checkbox';
import { Field, FieldCheckboxes } from 'components/field';
import ImageUpload from 'components/image/ImageUpload';
import { Input } from 'components/input';
import { Label } from 'components/label';
import { db } from 'firebase-app/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import useFirebaseImage from 'hooks/useFirebaseImage';
import DashboardHeading from 'module/dashboard/DashboardHeading';
import React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import slugify from 'slugify';
import { userRole, userStatus } from 'utils/constants';

const UserUpdate = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm({
    mode: 'onChange',
  });

  const watchStatus = watch('status');
  const watchRole = watch('role');

  const imageUrl = getValues('avatar');
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : '';

  const [params] = useSearchParams();
  const userId = params.get('id');

  const { image, setImage, handleResetUpload, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

  async function deleteAvatar() {
    const colRef = doc(db, 'users', userId);
    await updateDoc(colRef, {
      avatar: '',
    });
  }

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      const colRef = doc(db, 'users', userId);
      const docData = await getDoc(colRef);
      reset(docData && docData.data());
    }
    fetchData();
  }, [reset, userId]);

  const handleUpdateUser = async (values) => {
    if (!isValid) return;
    try {
      const colRef = doc(db, 'users', userId);
      await updateDoc(colRef, {
        ...values,
        avatar: image,
      });
      toast.success('update user information successfully');
    } catch (error) {
      console.log('🚀 ~ error', error);
      toast.success('Update user failed!');
    }
  };

  if (!userId) return null;

  return (
    <div>
      <DashboardHeading title="Update user" desc="Update user infomation"></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
          <ImageUpload
            className="!rounded-full h-full"
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            progress={progress}
            image={image}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input name="fullname" placeholder="Enter your fullname" control={control}></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input name="username" placeholder="Enter your username" control={control}></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          type="submit"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
