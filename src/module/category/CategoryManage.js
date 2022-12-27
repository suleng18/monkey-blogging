import { ActionDelete, ActionEdit, ActionView } from 'components/action';
import { LabelStatus } from 'components/label';
import { Table } from 'components/table';
import { db } from 'firebase-app/firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';
import DashboardHeading from 'module/dashboard/DashboardHeading';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { categoryStatus } from 'utils/constants';

const CategoryManage = () => {
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const colRef = collection(db, 'categories');
    onSnapshot(colRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoryList(results);
    });
  }, []);

  console.log(categoryList);

  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category"></DashboardHeading>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <span className="italic text-gray-400">{category.slug}</span>
                </td>
                <td>
                  {category.status === categoryStatus.APPROVED && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {category.status === categoryStatus.UNAPPROVED && (
                    <LabelStatus type="warning">Unapproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionView></ActionView>
                    <ActionEdit></ActionEdit>
                    <ActionDelete></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoryManage;
